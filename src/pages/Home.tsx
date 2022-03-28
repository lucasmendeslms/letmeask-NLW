import { useAuth } from '../hooks/useAuth'
import { useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'

import { Button } from '../components/Button'


import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss'


export function Home(){
    const [roomCode, setRoomCode] = useState('')
    const history = useHistory()
    const { signInWithGoogle, user } = useAuth()

    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle()
        }

        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault()

        if(roomCode.trim() === ''){
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        if(!roomRef.exists()){
            alert('Room does not exists')
            return
        }

        if(roomRef.val().endedAt){
            alert("Room already close")
            return
        }

        history.push(`/rooms/${roomCode}`)

        setRoomCode('')
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Illustration Image" />
                <strong>Cria sala de perguntas e repostas ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            
            <main>
                <div className="main-Content"> 
                    <img src={logoImg} alt="Imagem do logo" />

                    <button className="create-room" onClick={handleCreateRoom} >
                        <img src={googleIconImg} alt="Google Icon" />
                        Crie sua sala com o Google
                    </button>

                    <div className="separator" >ou entre em uma sala</div>

                    <form onSubmit={handleJoinRoom} >
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />

                        <Button type="submit">Entrar na sala</Button>
                    </form>

                </div>
            </main>
            
        </div>
    )
}