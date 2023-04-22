import { Note  as NoteModel } from 'FretboardModels';
import finger from '../../../assets/finger.svg'

interface Props {
    noteModel: NoteModel
}

const Fingers = ({noteModel}:Props): JSX.Element => {
    return (
      <div className='relative'>
        <svg className='absolute bottom-0 h-auto w-6 text-yellow-100'
          viewBox="0 0 19 18"
          xmlns="http://www.w3.org/2000/svg">
          <path
            id="path1859"
            stroke="#000000"
            strokeOpacity="1"
            strokeWidth="0.4"
            fill="currentColor"
            d="M 4.2929688,4.2714844 V 9.96875 c 0,2.684764 2.1609387,4.845703 4.8457031,4.845703 2.6847641,0 4.8457031,-2.160939 4.8457031,-4.845703 V 4.2734375 M 16.199219,18 V 9.4160156 c 0,-3.9120893 -3.148458,-7.0625 -7.0605471,-7.0625 -3.9120893,0 -7.0625,3.1504107 -7.0625,7.0625 V 18" />
            <text
              style={{fontSize: '0.6em'}}
              fill="#000000"
              x="5.6723266"
              y="12.676097"
              id="text1261">5</text>
        </svg>
      </div>
    )
  }
  
  export {Fingers}