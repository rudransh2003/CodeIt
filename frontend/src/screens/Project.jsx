import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webContainer.js'
import { toast } from 'react-toastify'
import { handleApiError } from '../utils/errorHandler.js'

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)
            ref.current.removeAttribute('data-highlighted')
        }
    }, [props.className, props.children])

    return <code {...props} ref={ref} />
}

const Project = () => {

    const location = useLocation()

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set()) // Initialized as Set
    const [project, setProject] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()

    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([]) // New state variable for messages
    const [fileTree, setFileTree] = useState({})

    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])

    const [webContainer, setWebContainer] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)

    const [runProcess, setRunProcess] = useState(null)

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }
            return newSelectedUserId;
        });
    }


    function addCollaborators() {
        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)
            toast.success("Collaborator Added Successfully!")
        }).catch(err => handleApiError(err, "Collaborator addition failed!"))
    }

    const send = () => {
        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [...prevMessages, { sender: user, message }]) // Update messages state
        setMessage("")
    }

    function WriteAiMessage(message) {
        return (
            <div className='overflow-auto bg-black text-white rounded-lg p-3 border border-white'>
                {message.text && (
                    <Markdown
                        children={message.text} // only pass string
                        options={{
                            overrides: {
                                code: SyntaxHighlightedCode,
                            },
                        }}
                    />
                )}
                {message.fileTree && (
                    <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700 text-xs text-gray-300">
                        <pre>{JSON.stringify(message.fileTree, null, 2)}</pre>
                    </div>
                )}
            </div>
        );
    }


    useEffect(() => {
        initializeSocket(project._id)
        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
                console.log("container started")
            })
        }
        receiveMessage('project-message', data => {
            console.log("Incoming message:", data);

            if (data.sender._id === 'ai') {
                let parsedMessage = {};

                if (typeof data.message === "string") {
                    // AI sent plain text
                    try {
                        parsedMessage = JSON.parse(data.message);
                    } catch {
                        parsedMessage = { text: data.message };
                    }
                } else if (typeof data.message === "object") {
                    // AI sent an object directly
                    parsedMessage = data.message;
                }

                if (parsedMessage.fileTree) {
                    const mergedTree = {
                        ...fileTree,
                        ...parsedMessage.fileTree
                    };

                    webContainer?.mount(mergedTree);
                    setFileTree(mergedTree);
                }


                setMessages(prev => [...prev, { ...data, message: parsedMessage }]);
            } else {
                setMessages(prev => [...prev, data]);
            }


        });

        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
            console.log(res.data.project)
            setProject(res.data.project)
            setFileTree(res.data.project.fileTree || {})
        })

        axios.get('/users/all').then(res => {
            setUsers(res.data.users)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }


    // Removed appendIncomingMessage and appendOutgoingMessage functions

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    return (
        <main className='h-screen w-screen flex bg-gray-900'>
            <section className="left relative flex flex-col h-screen min-w-96 bg-gray-800">
                <header className='flex justify-between items-center p-4 px-6 w-full bg-gray-700 absolute z-10 top-0 border-b border-gray-600'>
                    <button className='flex gap-2 items-center text-white hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors duration-200' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-fill"></i>
                        <span className="text-sm font-medium">Add Collaborator</span>
                    </button>
                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 text-white hover:bg-gray-600 rounded-lg transition-colors duration-200'>
                        <i className={`${isSidePanelOpen ? `ri-arrow-left-circle-line` : `ri-group-fill`}`}></i>
                    </button>
                </header>
                <div className="conversation-area pt-20 pb-16 flex-grow flex flex-col h-full relative">

                    <div
                        ref={messageBox}
                        className="message-box p-4 flex-grow flex flex-col gap-3 overflow-auto max-h-full scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index}
                                className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} 
                                ${msg.sender._id == user._id.toString() && 'ml-auto'}  
                                message flex flex-col p-3 bg-gray-700 w-fit rounded-lg border border-gray-600`}>
                                <small className='text-gray-300 text-xs mb-1'>{msg.sender.email}</small>
                                <div className='text-sm text-gray-100'>
                                    {msg.sender._id === 'ai'
                                        ? WriteAiMessage(msg.message) // msg.message is now { text, fileTree }
                                        : <p>{msg.message}</p>}
                                </div>
                            </div>
                        ))}

                    </div>

                    <div className="inputField w-full flex absolute bottom-0 p-4">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className='p-3 px-4 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 outline-none flex-grow rounded-l-lg focus:border-blue-500 transition-colors duration-200'
                            type="text"
                            placeholder='Type your message...' />
                        <button
                            onClick={send}
                            className='px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors duration-200'>
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>
                </div>
                <div className={`sidePanel w-full h-full flex flex-col bg-gray-800 absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0 border-r border-gray-600`}>
                    <header className='flex justify-between items-center px-6 py-4 bg-gray-700 border-b border-gray-600'>
                        <h1 className='font-semibold text-lg text-white'>Collaborators</h1>
                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 text-white hover:bg-gray-600 rounded-lg transition-colors duration-200'>
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>
                    <div className="users flex flex-col gap-2 p-4">
                        {project.users && project.users.map(user => (
                            <div key={user._id} className="user cursor-pointer hover:bg-gray-700 p-3 flex gap-3 items-center rounded-lg transition-colors duration-200">
                                <div className='aspect-square rounded-full w-10 h-10 flex items-center justify-center text-white bg-blue-600'>
                                    <i className="ri-user-fill"></i>
                                </div>
                                <h1 className='font-medium text-white'>{user.email}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="right bg-gray-900 flex-grow h-full flex">

                <div className="explorer h-full max-w-64 min-w-52 bg-gray-800 border-r border-gray-600">
                    <div className="file-tree w-full">
                        <div className="p-4 border-b border-gray-600">
                            <h2 className="text-white font-medium text-sm">Explorer</h2>
                        </div>
                        {
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([...new Set([...openFiles, file])])
                                    }}
                                    className="tree-element cursor-pointer p-3 px-4 flex items-center gap-2 hover:bg-gray-700 w-full text-left border-b border-gray-700 transition-colors duration-200">
                                    <i className="ri-file-text-line text-blue-400"></i>
                                    <p className='font-medium text-sm text-gray-200'>{file}</p>
                                </button>))
                        }
                    </div>
                </div>

                <div className="code-editor flex flex-col flex-grow h-full shrink">

                    <div className="top flex justify-between w-full bg-gray-800 border-b border-gray-600">

                        <div className="files flex">
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer p-3 px-4 flex items-center w-fit gap-2 text-sm font-medium border-r border-gray-600 transition-colors duration-200 ${currentFile === file
                                                ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }`}>
                                        <i className="ri-file-text-line text-xs"></i>
                                        <p>{file}</p>
                                        <i className="ri-close-line text-xs opacity-60 hover:opacity-100 ml-1"></i>
                                    </button>
                                ))
                            }
                        </div>

                        <div className="actions flex gap-2 p-2">
                            <button
                                onClick={async () => {
                                    await webContainer.mount(fileTree)
                                    const installProcess = await webContainer.spawn("npm", ["install"])
                                    installProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))
                                    if (runProcess) {
                                        runProcess.kill()
                                    }
                                    let tempRunProcess = await webContainer.spawn("npm", ["start"]);
                                    tempRunProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))
                                    setRunProcess(tempRunProcess)
                                    webContainer.on('server-ready', (port, url) => {
                                        console.log(port, url)
                                        setIframeUrl(url)
                                    })
                                }}
                                className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2'
                            >
                                <i className="ri-play-fill"></i>
                                Run
                            </button>
                        </div>
                    </div>
                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                        {
                            fileTree[currentFile] ? (
                                <div className="code-editor-area h-full overflow-auto flex-grow bg-gray-900">
                                    <pre className="hljs h-full">
                                        <code
                                            className="hljs h-full outline-none text-gray-100"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const updatedContent = e.target.innerText;
                                                const ft = {
                                                    ...fileTree,
                                                    [currentFile]: {
                                                        file: {
                                                            contents: updatedContent
                                                        }
                                                    }
                                                }
                                                setFileTree(ft)
                                                saveFileTree(ft)
                                            }}
                                            dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value }}
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                paddingBottom: '25rem',
                                                counterSet: 'line-numbering',
                                                padding: '1rem',
                                            }}
                                        />
                                    </pre>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center text-gray-400 flex-grow bg-gray-900">
                                    <h2 className="text-xl font-semibold text-white mb-3">
                                        👋 Welcome to Code-It
                                    </h2>
                                    <p className="max-w-md text-md leading-relaxed">
                                        Messages starting with @ai will be treated as ai prompts and will be visible for collaborators.
                                        <br />
                                        Select a file from the explorer to start editing, or create
                                        a new file using <span className="text-blue-400 font-semibold">@ai</span> prompts.
                                    </p>
                                </div>
                            )
                        }
                    </div>

                </div>

                {iframeUrl && webContainer &&
                    (<div className="flex min-w-96 flex-col h-full border-l border-gray-600">
                        <div className="address-bar bg-gray-800 border-b border-gray-600">
                            <input type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl}
                                className="w-full p-3 px-4 bg-gray-700 text-white placeholder-gray-400 border-none outline-none focus:bg-gray-600 transition-colors duration-200"
                                placeholder="Enter URL..." />
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full bg-white"></iframe>
                    </div>)
                }

            </section>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
                    <div className="bg-gray-800 border border-gray-600 p-6 rounded-xl w-96 max-w-full relative shadow-2xl">
                        <header className='flex justify-between items-center mb-6'>
                            <h2 className='text-xl font-semibold text-white'>Add Collaborators</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-20 max-h-80 overflow-auto">
                            {users.map(user => (
                                <div key={user.id} className={`user cursor-pointer hover:bg-gray-700 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-gray-700 border-blue-500' : "border-transparent"} p-3 flex gap-3 items-center rounded-lg border-2 transition-all duration-200`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-10 h-10 flex items-center justify-center text-white bg-blue-600'>
                                        <i className="ri-user-fill"></i>
                                    </div>
                                    <h1 className='font-medium text-white'>{user.email}</h1>
                                    {Array.from(selectedUserId).indexOf(user._id) != -1 && (
                                        <i className="ri-check-line text-blue-400 ml-auto"></i>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            disabled={selectedUserId.size === 0}
                            className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 ${selectedUserId.size === 0
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                                }`}>
                            Add Collaborators ({selectedUserId.size})
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project