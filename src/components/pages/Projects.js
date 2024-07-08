import Message from "../layout/Message"
import { useLocation } from "react-router-dom"
import Container from '../layout/Container'
import styles from './Projects.module.css'
import LinkButton from "../layout/LinkButton"
import ProjectCard from "../project/ProjectsCard"
import { useState, useEffect } from "react"
import Loading from '../layout/Loading'

function Projects() {

    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState('')

    const location = useLocation()
    let message = ''
    if (location.state) {
        message = location.state.message
    }

    useEffect(() => {
        setTimeout(() => {
            fetch('https://api.jsonbin.io/v3/b/668bec2dad19ca34f8849dfe', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(resp => resp.json())
                .then((data) => {
                    setProjects(data)
                    console.log(data)
                    setRemoveLoading(true)
                }).catch((err) => console.log(err))
        }, 300)
    }, [])

    function removeProject(id){
        fetch(`https://api.jsonbin.io/v3/b/668bec2dad19ca34f8849dfe${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type' : 'application/json'
            },
        }).then(resp => resp.json)
        .then(() => {
            setProjects(projects.filter((project) => project.id !== id))
            setProjectMessage('Project successfully removed.')
        })
        .catch(err => console.log(err))

    }

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>My Projects</h1>
                <LinkButton text="Create Project" to='/newProject' />
            </div>
            {message && <Message type="success" msg={message} />}
            {projectMessage && <Message type="success" msg={projectMessage} />}
            <Container customClass="start">
                {
                    projects.length > 0 && projects.map((project) => (
                        <ProjectCard
                            id={project.id}
                            name={project.name}
                            budget={project.budget}
                            category={project.category.name}
                            key={project.id}
                            handleRemove={removeProject}
                        />
                    ))
                }
                {
                    !removeLoading && <Loading />
                }
                {
                    removeLoading && projects.length === 0 && (
                        <p>There are no projects registered </p>
                    )
                }
            </Container>

        </div>

    )
}

export default Projects