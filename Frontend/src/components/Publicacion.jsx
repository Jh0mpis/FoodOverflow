import './Publicacion.css';
import {HiArrowCircleDown, HiArrowCircleUp} from "react-icons/hi";
import { LuChefHat } from "react-icons/lu";
import { BiComment } from "react-icons/bi";
import { Link } from 'react-router-dom';

export default function Publicacion ({id_post, userName, title, description, numComments, score, type}) {
    if (type === 'publications'){
        type = "publication"
    } else {
        type = "recipe"
    }
    return (
        <div>
            <Link to={`/${type}/${id_post}`} className='publicacion'>
                <div className='score'>
                <LuChefHat size={30} />
                    {score}
                    
                </div>
                <div className='contenido'>
                    <span className='userName'>{userName}</span>
                    <span className='title'>{title}</span>
                    <div className="description" dangerouslySetInnerHTML={{ __html: description }}></div>
                    <div className='comments'>
                        <BiComment />
                        {numComments}
                    </div>
                </div>
            </Link>
            <div className='separatorPost'></div>
        </div>
    )

}