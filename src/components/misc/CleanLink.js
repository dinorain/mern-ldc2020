import React from 'react'
import { Link } from 'react-router-dom'

export default (props) => {
  const defaultStyle = {
    textDecoration: 'none',
    outline: 'none',
    border: 'none'
  }
  const { to, style, ...restProps } = props
  return (
    <Link to={to || '#'} {...restProps} style={{ ...defaultStyle, ...style }}>
      {props.children}
    </Link>
  )
}
