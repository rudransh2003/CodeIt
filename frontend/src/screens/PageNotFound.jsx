import { useNavigate } from "react-router-dom"

const PageNotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="p-6 text-3xl font-sans">
            <h1>Unable to resolve the request! Unfortunately the page you requested was not found.</h1>
            <button 
                onClick={() => navigate("/home")} 
                className="underline text-blue-600 text-xl"
            >
                Revert Back
            </button>
        </div>
    )
}

export default PageNotFound