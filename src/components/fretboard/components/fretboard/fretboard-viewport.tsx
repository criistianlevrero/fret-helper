import fretboardStyles from './fretboard-viewport.module.css'

interface CardProps {
  children: React.ReactNode | React.ReactNode[];
}

function FretboardViewport({ children }: CardProps): JSX.Element{
  return (
    <div className='m-20 h-80'>
      <section className={fretboardStyles.fretboard}>
          {children}
      </section>
    </div>
  )
}

export default FretboardViewport
