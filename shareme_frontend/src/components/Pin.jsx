import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import {MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs'


import {urlFor,client} from '../client'
import { fetchUser } from '../utils/fetchUser'


const Pin = ({pin:{postedBy,image, _id, destination, save}}) => {
  // console.log(url)
  // const image_id = url.split('/')[6]
  // const reurl = `https://cdn.sanity.io/images/xih2ceve/production/${image_id}`
  const [postHovered, setPostHovered] = React.useState(false)
  // const [savingPost, setSavingPost] = React.useState(false)

  const navigate = useNavigate()

  const user = fetchUser()

  const alreadySaved = !!(save?.filter((item => item.postedBy._id === user.googleId)))?.length
  console.log(alreadySaved)
  // 1, [2,3,1] -> [1].length -> 1 -> !1 -> false -> !false ->true
  // 4, [2,3,1] -> [].length -> 0 -> !0 -> true -> !true -> false

  const savePin = (id) => {
    if(!alreadySaved){
      // setSavingPost(true)
      client
        .patch(id)
        .setIfMissing({save:[]})
        .insert('after', 'save[-1]', [
          {
            _key: uuidv4(),
            userId: user.googleId,
            postedBy: {
              _type: 'postedBy',
              _ref: user.googleId
            }
          }
        ])
        .commit()
        .then(() => {
          window.location.reload()
          // setSavingPost(false)
        })
    }
  }

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload()
      })
  }

  return(
    <div className='m-2 '>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition duration-200 ease-in-out'
      >
        <img className='rounded-lg w-full'  alt='user-post' src={(urlFor(image).width(250).url())} />
       
        {postHovered && (
          <div 
            className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
            style={{height: '100%'}}
            >
            <div className='flex items_center justify-between'>
              <div className='flex gap-2'>
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='bg-white w-9 h-9 p-2 rounded-full flex items_center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'                
                  ><MdDownloadForOffline/>
                </a>
              </div>
              {alreadySaved ? (
                <button
                  
                  type='button'
                  className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 rounded-3xl hover: shadow-md text-base outline-none'
                  >
                  {save?.length}Saved
                </button>
              ):(
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    savePin(_id)
                  }}
                  type='button'
                  className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 rounded-3xl hover: shadow-md text-base outline-none'
                  >
                  Save
                </button>
              )}
            </div>
            <div className='flex justify-between items-center gap-2 w-full'>
              {destination && (
                <a
                  href={destination}
                  target='blank'
                  rel='noreferrer'
                  className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md outline-none'
                  >
                    <BsFillArrowUpRightCircleFill/>
                    {destination.length>20 ? destination.slice(8,15): destination.slice(8,16)}

                </a>
              )}
              {postedBy?._id === user.googleId && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation()
                    deletePin(_id)
                  }}
                  className='bg-white p-2 opacity-70 hover:opacity-100  font-bold text-dark rounded-3xl hover: shadow-md text-base outline-none'
                  >
                    <AiTwotoneDelete/>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link to={`user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
        <img
          className='w-8 h-8 rounded-full object-cover'
          src={postedBy?.image}
          alt='user-profile'
        />
        <p className='font-semibold capitalize'>{postedBy?.userName}</p>
      </Link>
      
        
    </div>
  )
}

export default Pin
