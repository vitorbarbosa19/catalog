import React, {useState} from 'react'
import { motion } from 'framer-motion';
// Components Ziro
import Header from '@bit/vitorbarbosa19.ziro.header'
import { useMessage } from "@bit/vitorbarbosa19.ziro.message-modal"
import { useFooter } from "@bit/vitorbarbosa19.ziro.flow-manager/dist/FlowManager/hooks";
import { containerWithPadding } from "@ziro/theme";
// Internal Components
import ValidationForm from './components/ValidationForm'

const DoubleValidation = () => {
    const [cnpj, setCnpj] = useState('')
    const [lastFour, setLastFour] = useState('')
    const [selfie, setSelfie] = useState('')
    const [filenameSelfie, setFilenameSelfie] = useState('')
    const [card, setCard] = useState('')
    const [filenameCard, setFilenameCard] = useState('')
    const setMessage = useMessage();
    useFooter(null)
    const state = {selfie, setSelfie, filenameSelfie, setFilenameSelfie, card, setCard, filenameCard, setFilenameCard, setMessage, cnpj, setCnpj, lastFour, setLastFour}
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <div style={{marginTop:'10px'}}>
                <Header type="title-only" title='Cartão e Selfie' />
                <ValidationForm state={state} />
            </div>
        </motion.div>
    )
}

export default DoubleValidation