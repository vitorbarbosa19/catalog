import React from 'react'
import trends from '../trends'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { row, container } from './styles'

export default ({ trend, setTrend }) => {

    return (
        <div style={container}>
            {
                trends.map(_trend => (
                    <div key={_trend} onClick={() => setTrend(_trend)} style={row}>
                        <label style={{ fontWeight: _trend===trend ? 'bold' : 'normal'}}>{_trend}</label>
                        <svg height={18} width={18} viewBox={`0 0 18 18`}>
                            <circle cx={9} cy={9} r={7} fill='none' stroke={'black'} strokeWidth={_trend === trend ? '3' : '1'} />
                            {_trend === trend ? <circle cx={9} cy={9} r={3} fill={'black'} /> : null}
                        </svg>
                    </div>
                ))
            }
            <Button
                type='button'
                cta='limpar'
                template='light'
                click={() => setTrend()}
            />
        </div>
    )
}