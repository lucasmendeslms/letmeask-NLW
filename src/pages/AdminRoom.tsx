import { useHistory, useParams } from 'react-router-dom'
import { database } from '../services/firebase'

import { Button }  from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useRoom } from '../hooks/useRoom'
import { Question } from '../components/Question'

import '../styles/room.scss'
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answer from '../assets/images/answer.svg'


type RoomParams = {
    id: string
}

export function AdminRoom() {
    const params = useParams<RoomParams>()
    const history =  useHistory()
    const roomId = params.id
    const { questions, title } = useRoom(roomId) 

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/')
    }
    
    async function handleDeleteQuestion(questionId: string){
        if(window.confirm("Tem certeza que deseja excluir essa pergunta?")){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })
    }

    async function handleHighlightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        })
    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Logo image" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined={true} onClick={handleEndRoom} >Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title} </h1>
                    {
                        questions.length > 0 && <span> {questions.length} {questions.length > 1 ? "perguntas": "pergunta" } </span>
                    }
                    
                </div>
                
                <div className="question-list">
                    {
                        questions.map(question => {
                            return (
                                <Question key={question.id} content={question.content} author={question.author} isHighlighted={question.isHighlighted} isAnswered={question.isAnswered} >
                                    {!question.isAnswered && (
                                        <>
                                            <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)} >
                                                <img src={checkImg} alt="Ckeck question" />
                                            </button>
                                            <button type="button" onClick={() => handleHighlightQuestion(question.id)} >
                                                <img src={answer} alt="Answer question" />
                                            </button> 
                                        </>
                                    )}
                                    <button type="button" onClick={() => handleDeleteQuestion(question.id)} >
                                        <img src={deleteImg} alt="Delete question" />
                                    </button>
                                </Question>
                            )
                        })
                    }
                </div>

            </main>
        </div>
    )
}