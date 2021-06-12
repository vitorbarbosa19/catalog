import React from 'react'
import { useLocation } from 'wouter'
import LoginTrouble from '@bit/vitorbarbosa19.ziro.login-trouble'

export default ({ isLogged }) => {
	const [, setLocation] = useLocation()
	if (isLogged) setLocation('/galeria')
	return <LoginTrouble navigateTo='/login' />
}