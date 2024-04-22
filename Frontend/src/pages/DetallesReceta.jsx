import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { TbChefHatOff } from "react-icons/tb";
import { TbChefHat } from "react-icons/tb";
import axios from "../api/axios.jsx";
import { BiComment } from "react-icons/bi";
import './DetallesReceta.css';
import Cookies from 'universal-cookie';
import Comentario from "../components/Comentario";

function DetallesReceta() {
    const { id } = useParams();
    const [author, setAuthor] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [numComments, setNumComments] = useState();
    const [ingredients, setIngredients] = useState([]);
    const [score, setScore] = useState();
    const [voted, setVoted] = useState(false); 
    const [lastVote, setLastVote] = useState(0);
    const [comment, setComment] = useState('');
    const [voteStatus, setVoteStatus] = useState(0);
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const [showButtons, setShowButtons] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [comments, setComments] = useState([]);
    const [reload, setReload] = useState(false)
    const url =  import.meta.env.VITE_API_URL;

    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

    const ocultarAlerta = () => {
        setAlertVisible(false);
      };
    
    const handleChangeComment = (event) => {
        const comment = event.target.value;
        setComment(comment);
    };
    
    const handleInputCommentClick = () => {
        jwt ? (
          setShowPlaceholder(false),
          setShowButtons(true)
        )
        : alert("Debes iniciar sesión para comentar")
        
    };
    
    const discartComment = () => {
        setComment("");
        setShowPlaceholder(true);
        setShowButtons(false);
        ocultarAlerta();
    };
    
    const handleInputCommentCancel = () => {
        if (!comment) {
          setShowPlaceholder(true);
          setShowButtons(false);
        } else {
          setAlertVisible(true);
        }
    };

    const handleVote = async (voteType) => {
        try {
            // Determinar el voto a enviar al backend
            const voteToSend = voted && voteType === lastVote ? 0 : voteType;
    
            const response = await axios.post(`${url}/vote/recipe/`, {
                post_id: id,
                jwt: jwt,
                vote_type: voteToSend
            });
    
            if (response.data.type === "SUCCESS") {
                // Si el voto enviado es 0, el usuario está eliminando su voto
                if (voteToSend === 0) {
                    setVoted(false);
                    setLastVote(0);
                    setVoteStatus(0);
                    //cookies.remove("auth_token");
                    // Si el voto eliminado era positivo, se resta 1 al score, si era negativo, se suma 1
                    setScore(score - (lastVote === 1 ? 1 : (lastVote === -1 ? -1 : 0)));
                } else {
                    // Si el usuario ya había votado y ahora cambia su voto, se suma o resta 2 al score según corresponda
                    const scoreChange = voted ? (voteToSend === 1 ? 2 : -2) : (voteToSend === 1 ? 1 : -1);
                    setVoted(true);
                    setLastVote(voteToSend);
                    setVoteStatus(voteToSend);
                    setScore(score + scoreChange);
                }
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        }
    };
    

    useEffect(() => {
        obtenerDetallesReceta(id);
    }, [reload]);

    const obtenerDetallesReceta = async (id) => {
        try {
          const res = await axios.post(`${url}/recipe/`, {
            recipe_id: id,
            jwt : jwt
          });
          if (res.data.type === "SUCCESS") {
            setAuthor(res.data.username);
            setTitle(res.data.title);
            setDescription(res.data.description);
            setNumComments(res.data.numComments);
            setIngredients(res.data.ingredients.split("_"));
            setScore(res.data.score);
            setComments(res.data.recipe_comments);
            setLastVote(res.data.vote_type > 0 ? 1 : (res.data.vote_type < 0 ? -1 : 0));
            setVoteStatus(res.data.vote_type);
            const userHasVoted = res.data.vote_type !== 0;
            setVoted(userHasVoted);
          } else {
            alert(res.data.message);
          }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        }
    };

    const submitComment = async () => {
        try {
          const res = await axios.post(
            `${url}/comment/recipe/`,
            {
              post_id: id,
              content: comment,
              jwt: jwt,
            }
          );
          if (res.data.type === "SUCCESS") {
            alert(res.data.message);
            setComment("");
            setShowPlaceholder(true);
            setShowButtons(false);
            setReload(!reload);
          } else {
            alert(res.data.message);
          }
        } catch (error) {
          console.error("Error al realizar la solicitud:", error);
        }
    };


    return (
        <div className='dp-container'>
            <div className='dp-post'>
                <div className='dp-score'>
                    <button className={`vote-button ${voted && lastVote === 1 ? 'voted' : ''} ${voteStatus === 1 ? 'user-voted' : ''}`} onClick={() => handleVote(1)}>
                        <TbChefHat size={30} />
                    </button>
                    {score}
                    <button className={`vote-button ${voted && lastVote === -1 ? 'voted' : ''} ${voteStatus === -1 ? 'user-voted' : ''}`} onClick={() => handleVote(-1)}>
                        <TbChefHatOff size={30} />
                    </button>
                </div>
                <div className='dp-contenido'>
                    <span className='dp-userName'>{author}</span>
                    <span className='dp-title'>{title}</span>
                    {ingredients.length > 0 && (
                        <div className='dp-ingredients'>
                            <h4>Ingredientes:</h4>
                            <ul>
                                {ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="dp-description" dangerouslySetInnerHTML={{ __html: description }}></div>
                    <div className='dp-numComments'>
                        <BiComment />
                        {numComments}
                    </div>
                </div>
            </div>
            <div className='dp-makeComment'>
                <input
                placeholder={showPlaceholder ? "Escribe un comentario..." : ""}
                className="dp-input-comment"
                type="text"
                value={comment}
                onChange={handleChangeComment}
                onClick={handleInputCommentClick}
                />
                {showButtons && (
                <div className="dp-makeComment-buttons-cancel-comment">
                    <button
                    className="dp-button-cancel"
                    onClick={handleInputCommentCancel}
                    >
                    Cancelar
                    </button>
                    <button className="dp-button-comment" onClick={submitComment}>
                    Comentar
                    </button>
                </div>
                )}
            </div>
            <div className='dp-comments'>
                Comentarios
            </div>
            {alertVisible && (
                <div className="dp-alert-cancel">
                    <div className="dp-alert-cancel-content">
                        <div className="dp-alert-cancel-content-title">
                            <span className="dp-title">¿Descartar comentario?</span>
                            <span className="close" onClick={ocultarAlerta}>
                            &times;
                            </span>
                        </div>
                        <div className="dp-description">
                            Tienes un comentario en progreso, ¿estás seguro de que quieres
                            descartarlo?
                        </div>
                        <div className="dp-alert-cancel-buttons">
                            <button className="dp-button-cancel" onClick={ocultarAlerta}>
                                Cancelar
                            </button>
                            <button className="dp-button-discard" onClick={discartComment}>
                                Descartar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {comments.map((comment) => (
                <Comentario
                    key={comment.comment_id}
                    reload={reload}
                    setReload={setReload}
                    post_id={id}
                    jwt={jwt}
                    comment_id={comment.comment_id}
                    comment_content={comment.comment_content}
                    comment_user={comment.comment_user}
                    response_list={comment.response_list}
                    type="recipe"
                />
                ))
            }
        </div>
    );
}

export default DetallesReceta;