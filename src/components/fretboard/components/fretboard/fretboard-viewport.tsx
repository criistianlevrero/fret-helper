import fretboardStyles from './fretboard-viewport.module.css'

interface CardProps {
  children: React.ReactNode | React.ReactNode[];
}

function FretboardViewport({ children }: CardProps): JSX.Element{
  return (
    <div className='p-20 overflow-auto'>
      <section className={fretboardStyles.fretboard}>
          {children}
      </section>
    </div>
  )
}

export default FretboardViewport
