import React from 'react'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'

const Empty = () => {

	return (
		<div style={{ display: 'grid', maxWidth: '350px', margin: '0 auto', padding: '20px', gridGap: '20px', justifyItems: 'center' }}>
			<Illustration type='timelineStart' size={150} />
            <label style={{ textAlign: 'center' }}>Item que estava aqui foi apagado!</label>
		</div>
	)
}


export default Empty
