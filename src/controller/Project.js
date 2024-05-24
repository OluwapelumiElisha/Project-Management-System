const Project = require("../model/Project")


const handleCreateProject = async (req, res) => {
    try {
        const { name, description, userId } = req.body
        // const users = req.user
        // console.log(req.body, users);
        if (!name || !description) {
            return res.status(404).json({ message: "Please provide name and description" });
          }
          const project = await Project.create({ name, description, userId });
          res.status(200).json(project);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error creating data", error });  
    }

}


module.exports = { handleCreateProject }