import { useCallback, useEffect, useRef, useState } from 'react'
import Quill from 'quill';
import "quill/dist/quill.snow.css"; // the styles for the editor
import { io } from 'socket.io-client'

const Font = Quill.import('attributors/style/font'); // import font style
Font.whitelist = ['Arial', 'Verdana', 'Roboto']; // whitelist fonts
Quill.register(Font, true); // register fonts

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // header options
    [{ font: Font.whitelist }], // use whitelisted fonts
    [{ list: 'ordered' }, { list: 'bullet' }], // list options
    ['bold', 'italic', 'underline'], // style options
    [{ color: [] }, { background: [] }], // color options
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ align: [] }], // text align options
    ['image', 'blockquote', 'code-block'], // embeds
    ['clean']] // remove formatting button




export default function TextEditor() {
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()

    useEffect(() => {
        const s = io('http://localhost:3001') // this is the url of the server.  here we connect
        setSocket(s)

        return () => {
            s.disconnect() // disconnect when we are done
        }

    }, []) // the [] I think is to make sure it only runs once

    useEffect(() => {
        if (socket == null || quill == null) return // if socket or quill is null then we dont want to do anything

        const handler = (delta) => {
            quill.updateContents(delta) // update the quill with the delta
        }
        socket.on('receive-changes', handler)
        // send the changes to the server


        return () => {
            socket.off('receive-changes', handler) // remove the listener when we are done

        }
    }, [socket, quill]) // we want to run this when the socket and quill changes

    useEffect(() => {
        if (socket == null || quill == null) return // if socket or quill is null then we dont want to do anything

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return // only want to track the user made
            socket.emit('send-changes', delta)
        }
        quill.on('text-change', handler) // this is a listener for the text change event
        // send the changes to the server


        return () => {
            quill.off('text-change', handler) // remove the listener when we are done

        }
    }, [socket, quill]) // we want to run this when the socket and quill changes

    const wrapperRef = useCallback((wrapper) => {                        // using callback and passing it to our ref
        if (wrapper == null) return                                     // if wrapper is null then we dont want to do anything
        wrapper.innerHTML = ''                                          //every time we run this we want to reset this
        const editor = document.createElement('div')
        wrapper.append(editor)                                          //current to get the current ref
        const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } })                            // quill will be using the editor
        setQuill(q)

    }, [])
    return <div className='container' ref={wrapperRef}></div>
}
