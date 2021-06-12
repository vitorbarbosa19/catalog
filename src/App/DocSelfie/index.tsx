import React, {useState} from 'react'
import { motion } from 'framer-motion';
// Components Ziro
import Header from '@bit/vitorbarbosa19.ziro.header'
import { useMessage } from "@bit/vitorbarbosa19.ziro.message-modal"
import { useFooter } from "@bit/vitorbarbosa19.ziro.flow-manager/dist/FlowManager/hooks";
import { containerWithPadding } from "@ziro/theme";
// Internal Components
import DoctypeNull from './components/DoctypeNull'
import DoctypeRG from './components/DoctypeRG'
import DoctypeCNH from './components/DoctypeCNH'

const DocSelfie = () => {
    const [cnpj, setCnpj] = useState('')
    const [docType, setDocType] = useState('')
    const [frontDoc, setFrontDoc] = useState('')
    const [filenameFront, setFilenameFront] = useState('')
    const [backDoc, setBackDoc] = useState('')
    const [filenameBack, setFilenameBack] = useState('')
    const [selfieDoc, setSelfieDoc] = useState('')
    const [filenameSelfie, setFilenameSelfie] = useState('')
    const setMessage = useMessage();
    useFooter(null)
    const state = {setMessage, cnpj, setCnpj, docType, setDocType, frontDoc, setFrontDoc, filenameFront, setFilenameFront, backDoc, setBackDoc, filenameBack, setFilenameBack, selfieDoc, setSelfieDoc, filenameSelfie, setFilenameSelfie}
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <div style={{marginTop:'10px'}}>
                <Header type="title-only" title='Documento e Selfie' />
                {!docType && (<DoctypeNull state={state}/>)}
                {docType === 'RG' && (<DoctypeRG state={state} />)}
                {docType === 'CNH' && (<DoctypeCNH state={state} />)}
            </div>
        </motion.div>
    )
}

export default DocSelfie