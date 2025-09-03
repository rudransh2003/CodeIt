import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: [ true, 'Project name must be unique' ],
    },
    description: {
        type: String,
        lowercase: true,
        required: true
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    fileTree: {   // represents the folder & file structure
        type: Object,
        default: {}
    },
    messages: [   // NEW FIELD for chat persistence
        {
            sender: {
                _id: { type: String },
                email: { type: String }
            },
            message: {
                text: { type: String },
                fileTree: { type: Object, default: {} }
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const Project = mongoose.model('project', projectSchema);

export default Project;