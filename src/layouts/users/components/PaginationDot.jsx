import React from "react"
import PropTypes from "prop-types"

const styles = {
  root: {
    height: 18,
    width: 18,
    cursor: "pointer",
    border: 0,
    background: "none",
    padding: 0,
    marginRight: "5px",
  },
  dot: {
    backgroundColor: "inherit",
    border: "2px solid #1976D2",
    height: 16,
    width: 16,
    borderRadius: "17px",
    margin: 3,
  },
  active: {
    width: "45px",
    backgroundColor: "#1976D2",
  },
}

function PaginationDot(props) {
  const handleClick = event => {
    props.onClick(event, props.index)
  }

  const { active } = props

  let styleDot

  if (active) {
    styleDot = Object.assign({}, styles.dot, styles.active)
  } else {
    styleDot = styles.dot
  }

  return (
    <button type="button" style={styles.root} onClick={handleClick}>
      <div style={styleDot} />
    </button>
  )
}

PaginationDot.propTypes = {
  active: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default PaginationDot
