const ChatPanel = (
    {
        messages,
        user,
        projectUsers,
        project,
        message,
        setMessage,
        send,
        WriteAiMessage,
        isModalOpen,
        setIsModalOpen,
        isSidePanelOpen,
        setIsSidePanelOpen,
        messageBox
    }
) => {
    return (
        <>
            <section className="left relative flex flex-col h-screen min-w-96 bg-gray-800">
                <header className='flex justify-between items-center p-4 px-6 w-full bg-gray-700 absolute z-10 top-0 border-b border-gray-600'>
                    <button className='flex gap-2 items-center text-white hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors duration-200'
                        onClick={() => setIsModalOpen(true)}>
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
                        {(project?.users || []).map((collaborator) => {
                            const isCurrentUser = collaborator._id === user._id;

                            return (
                                <div
                                    key={collaborator._id}
                                    className="user cursor-pointer hover:bg-gray-700 p-3 flex gap-3 items-center rounded-lg transition-colors duration-200"
                                >
                                    <div className="aspect-square rounded-full w-10 h-10 flex items-center justify-center text-white bg-blue-600">
                                        <i className="ri-user-fill"></i>
                                    </div>
                                    <h1 className="font-medium text-white">
                                        {collaborator.email} {isCurrentUser && <span className="text-gray-400">(you)</span>}
                                    </h1>
                                </div>
                            );
                        })}
                    </div>


                </div>
            </section>
        </>
    )
}
export default ChatPanel