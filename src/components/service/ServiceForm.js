import { useState } from 'react'
import Input from '../form/Input'
import SubmitButton from '../form/SubmitButton'

import styles from '../project/ProjectCard.module.css'
function ServiceForm({ handleSubmit, btnText, projectData }) {
    const [service, setService] = useState([])
    function submit(e) {
        e.preventDefault()
        projectData.services.push(service)
        handleSubmit(projectData)
    }
    function handleChange(e) {
        setService({ ...service, [e.target.name]: e.target.value})
    }
    return (
        <form onSubmit={submit} className={styles.form}>
            <Input
                type="text"
                text="Name Service"
                name="name"
                placeholder="Name service"
                handleOnChange={handleChange}
            />
            <Input
                type="number"
                text="Cost Service"
                name="cost"
                placeholder="Cost service"
                handleOnChange={handleChange}
            />
            <Input
                type="text"
                text="Description Service"
                name="description"
                placeholder="Description service"
                handleOnChange={handleChange}
            />
            <SubmitButton text={btnText}/>
        </form>
    )
}

export default ServiceForm