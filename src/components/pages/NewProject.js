import ProjectForm from '../project/ProjectForm';
import { useNavigate } from 'react-router-dom';
import styles from './NewProject.module.css';

function NewProject() {
    const navigate = useNavigate();
    function createPost(project) {
        // Inicialize o custo e os serviços
        project.cost = 0;
        project.services = [];
        fetch("https://api.jsonbin.io/b/668be34fe41b4d34e40eddff", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                // Redirecionar
                navigate('/projects', { state: { message: 'Projeto criado com sucesso' } });
            })
            .catch(err => console.log(err));
    }
    return (
        <div className={styles.newproject_container}>
            <h1>Create a Project</h1>
            <p>Create your project and then add the services</p>
            <ProjectForm handleSubmit={createPost} btnText="Create Project" />
        </div>
    );
}
export default NewProject;
