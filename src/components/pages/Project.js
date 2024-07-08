import { parse, v4 as uuidv4 } from 'uuid'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import styles from './Project.module.css'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

function Project() {
    const { id } = useParams()


    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        setTimeout(() => {
            fetch(`https://api.jsonbin.io/v3/b/668bec2dad19ca34f8849dfe${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((resp) => resp.json())
                .then((data) => {
                    setProject(data)
                    setServices(data.services)
                });
        }, 3000)
    }, [id]);

    function editPost(project) {
        setMessage('')
        // Budget Validation
        if (project.budget < project.cost) {
            setMessage('The project budget cannot be less than the project cost. Please adjust the budget accordingly')
            setType('error')
            return false
        }

        fetch(`https://api.jsonbin.io/v3/b/668bec2dad19ca34f8849dfe${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        })
            .then(resp => resp.json())
            .then((data) => {
                setProject(data)
                setShowProjectForm(false)
                setMessage('The project has been updated successfully')
                setType('success')
            })
            .catch(err => console.log(err))
    }

    function createService(project) {
        // last service
        const lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        // maximum value validation
        if (newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço!')
            setType('error')
            project.services.pop()
            return false
        }

        // add service cost to project cost total
        project.cost = newCost

        fetch(`https://api.jsonbin.io/v3/b/668bec2dad19ca34f8849dfe${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setServices(data.services)
                setShowServiceForm(!showServiceForm)
                setMessage('Serviço adicionado!')
                setType('success')
            })
    }
    function removeService(id, cost) {
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )
        const projectUpdated = project

        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`https://api.jsonbin.io/v3/b/668bec2dad19ca34f8849dfe${projectUpdated.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        }).then((resp) => resp.json())
        .then((data) => {
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage('The service has been successfully removed.')

        })
        .catch((err) => console.log(err))
     }
    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }
    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    return (
        <>
            {project.name ?
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} />}

                        <div className={styles.details_container}>
                            <h1>Project: {project.name}</h1>
                            <button onClick={toggleProjectForm} className={styles.btn}>{!showProjectForm ? 'Edit Project' : 'Close'}</button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categories:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Budget:</span> R${project.budget}
                                    </p>
                                    <p>
                                        <span>Total Used:</span> R${project.cost}
                                    </p>
                                </div>

                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm handleSubmit={editPost} btnText={'Save'} projectData={project} />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_from_container}>
                            <h2> Add Service</h2>
                            <button onClick={toggleServiceForm} className={styles.btn}>
                                {!showServiceForm ? 'Add Service' : 'Close'}
                            </button>
                            <div className={styles.project_info}>
                                {
                                    showServiceForm && (
                                        <ServiceForm
                                            handleSubmit={createService}
                                            btnText="Add Service"
                                            projectData={project}
                                        />
                                    )
                                }
                            </div>
                        </div>
                        <h2>Services</h2>
                        <Container customClass="start">
                            {services.length > 0 && services.map((service) => (
                                <ServiceCard
                                    id={service.id}
                                    name={service.name}
                                    cost={service.cost}
                                    description={service.description}
                                    key={service.id}
                                    handleRemove={removeService}
                                />
                            ))
                            }
                            {services.length === 0 && <p>
                                No services have been registered yet</p>

                            }
                        </Container>
                    </Container>
                </div>
                : <Loading />}
        </>
    )
}

export default Project