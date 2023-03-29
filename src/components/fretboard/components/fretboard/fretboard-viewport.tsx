import './fretboard-viewport.css'

interface CardProps {
  children: React.ReactNode | React.ReactNode[];
}

function FretboardViewport({ children }: CardProps): JSX.Element{
  return (
    <div className='m-20 h-80'>
      <section className="fretboard grid grid-cols-27">
          {children}
      </section>
    </div>
  )
}

export default FretboardViewport
