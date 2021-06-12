import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { ZiroPromptMessage } from "ziro-messages";
import { dropzone, instructions, button, input, styleTag } from './styles'

const FailureMessage = (msg) =>{
    return new ZiroPromptMessage({
        name: "failTest",
        type: "destructive",
        code: "202",
        title: "Ocorreu um erro!",
        userDescription: msg,
        userResolution: "Tente novamente ou contate suporte.",
        internalDescription: "prompt de falha",
        illustration: "errorLoading",
        additionalData: undefined,
    });
}

const ImageUpload = ({ setFile, filename, setFilename, indexOfFile, setMessage }) => {

    const handleDragEnter = e => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDragLeave = e => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDragOver = e => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDrop = async e => {
        e.preventDefault()
        e.stopPropagation()
        const file = e.dataTransfer.files[0]
        if(file && file.name){
            setFilename(file.name)
            setFile(file)
        }else{
            if(setMessage){
                setMessage(FailureMessage('Imagem inválida, tento outra imagem.'))
            }
            setFilename('')
            setFile('')
        }
    }
    const handleChange = async e => {
        const file = e.target.files[0]
        if(file && file.name){
            setFilename(file.name)
            setFile(file)
        }else{
            if(setMessage){
                setMessage(FailureMessage('Imagem inválida, tento outra imagem.'))
            }
            setFilename('')
            setFile('')
        }
    }
    return (
        <div
            style={dropzone}
            className='dropzone'
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onChange={handleChange}
        >
            <style>{styleTag}</style>
            <label style={instructions}>{filename !== '' ? filename : 'Arraste imagens ou escolha do dispositivo'}</label>
            <motion.label
                style={button}
                htmlFor={`input-file${indexOfFile}`}
                whileTap={{ scale: 0.95 }}
            >Escolher
			</motion.label>
            <input
                style={input}
                id={`input-file${indexOfFile}`}
                type='file'
            />
        </div>
    )
}

ImageUpload.propTypes = {
    setMessage: PropTypes.func,
    setFile: PropTypes.func,
    indexOfFile: PropTypes.number,
    persistFilename: PropTypes.string
}

export default ImageUpload
