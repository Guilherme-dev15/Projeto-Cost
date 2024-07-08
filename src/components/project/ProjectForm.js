import { useEffect, useState } from 'react'

import styles from './ProjectForm.module.css'
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'

function ProjectForm({ handleSubmit, btnText, projectData }) {
    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || {})
    useEffect(() => {
        fetch("https://api.jsonbin.io/v3/b/668bec2dad19ca34f8849dfe/categories", {
            method: "Get",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setCategories(data)
            })
            .catch(err => console.log(err))
    }, [])

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
        //console.log(project)
    }

    function handleChange(e) {
        setProject({ ...project, [e.target.name]: e.target.value })
    }

    function handleCategory(e) {
        setProject({
            ...project, category: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text,
            },
        })
    }

    return (

        <form action="" className={styles.form} onSubmit={submit}>
            <Input type={'text'} text={'Project Name: '} name={'name'} placeholder={'Project Name'} handleOnChange={handleChange} value={project.name ? project.name: ''}/>
            <Input type={'number'} text={'Project Budget: '} name={'budget'} placeholder={'Project Budget'} handleOnChange={handleChange} value={project.budget} />

            <Select name={'category_id'} text={'Category: '} options={categories} handleOnChange={handleCategory} value={project.category ? project.category.id : ''} />

            <SubmitButton text={btnText} />

        </form>
    )
}

export default ProjectForm