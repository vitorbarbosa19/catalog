import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import TabDualHeader from '@bit/vitorbarbosa19.ziro.tab-dual-header'
import TabDualTransition from '@bit/vitorbarbosa19.ziro.tab-dual-transition'

const Tabs = ({ pathOne, tabNameOne, pathTwo, tabNameTwo, children }) => {

  useEffect(() => {
    const location = window.location.pathname
    const elemHeight = document.getElementById('tabDual')
    if (location.split('/')[2] === 'fisica') elemHeight.style.height = '590px'
    else elemHeight.style.height = '1200px'
  }, [window.location.pathname])

  return (
    <>
      <TabDualHeader
        pathOne={pathOne}
        tabNameOne={tabNameOne}
        pathTwo={pathTwo}
        tabNameTwo={tabNameTwo}
      />
      <TabDualTransition components={[
        { path: pathOne, children: children[0] },
        { path: pathTwo, children: children[1] }
      ]} />
    </>
  )
}

Tabs.propTypes = {
  pathOne: PropTypes.string.isRequired,
  tabNameOne: PropTypes.string.isRequired,
  pathTwo: PropTypes.string.isRequired,
  tabNameTwo: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.element)
}

export default Tabs
