import React from 'react'
import {default as PT} from 'prop-types'

const ChartLine = ({ children, ranges, colors }) => {
  const lines = separateRanges(ranges)
  const max = ranges.map(range => Math.max(...range))
  const fillD = `M 0 0 ${drawPath(max)} V 0 H 0 Z`

  return (
    <div className="ola_chartLine">
      { children }
      {
        <svg role="img" viewBox="0 0 100 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="ola_chartLine-svg">
          <path d={fillD} vectorEffect="non-scaling-stroke" strokeLinejoin="round" className="ola_chartLine-svg-background" />
          {
            lines.map((line, index) => {
              const draw = drawPath(line)
              const lineD = `M 0 0 ${draw}`
              const style = colors[index] ? {'--color': colors[index]} : undefined
              return <path key={index} d={lineD} vectorEffect="non-scaling-stroke" strokeLinejoin="round" className="ola_chartLine-svg-line" style={style} />
            })
          }
        </svg>
      }
    </div>
  )
}

ChartLine.defaultProps = {
  ranges: [],
  colors: [],
}

ChartLine.propTypes = {
  /** All range values */
  ranges: PT.arrayOf(PT.arrayOf(PT.number)).isRequired,
  /** All color values */
  colors: PT.arrayOf(PT.string),
  /** Childen nodes */
  children: PT.oneOfType([
    PT.arrayOf(PT.node),
    PT.node
  ]).isRequired
}

export default ChartLine

function drawPath(values) {
  const distance = 100 / values.length
  const commands = [`M 0 ${getYPosition(values[0])}`]
  let x = distance / 2

  values.forEach((value) => {
    commands.push(`L ${x} ${getYPosition(value)}`)
    x += distance
  })

  commands.push(`L 100 ${getYPosition(values[values.length - 1])}`)

  return commands.join(' ')
}

function getYPosition(value) {
  return 150 - (value * 150) + 5
}

function separateRanges(ranges) {
  return new Array(ranges[0].length)
    .fill([])
    .map((value, index) =>
      ranges.map((range) => range[index])
    )
}