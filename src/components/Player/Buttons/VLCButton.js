import React from 'react'
import styled from 'styled-components'

const ButtonObj = styled.button`
cursor: pointer;
position: relative;
text-align: center;
margin: 0;
padding: 0;
height: 100%;
width: 4em;
-webkit-flex: none;
flex: none;
background: none;
border: none;
color: inherit;
display: inline-block;
font-size: inherit;
line-height: inherit;
text-transform: none;
text-decoration: none;
transition: none;
-webkit-appearance: none;
appearance: none;
transition: text-shadow .2s ease;

&:focus{
    outline: 0!important;
}

&:hover{
    text-shadow: 0em 0em 1em white;
}

`

const PopupText = styled.span`
border: 0;
clip: rect(0 0 0 0);
height: 1px;
overflow: hidden;
padding: 0;
position: absolute;
width: 1px;
`

const openInVlc = (url, title) => {
    if (!url) return;

    // Try the VLC custom protocol first (works when VLC has registered the vlc:// handler).
    try {
        window.location.href = "vlc://" + url;
    } catch (e) { /* ignore */ }

    // Fallback: download an .m3u playlist that opens in the user's default media player (VLC).
    const content = "#EXTM3U\n#EXTINF:-1," + (title || "Stream") + "\n" + url + "\n";
    const blob = new Blob([content], { type: "audio/x-mpegurl" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = (title ? title.replace(/[^a-z0-9]/gi, "_") : "stream") + ".m3u";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

const VLCButton = ({ url, title }) => {
    return (
        <ButtonObj type="button" title="Open in VLC" onClick={() => openInVlc(url, title)}>
          <i>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" fill="currentColor">
              <path d="M30.6 30.2H17.4l-1.9 5.1c-.2.5.2 1 .8 1h15.4c.6 0 1-.5.8-1l-1.9-5.1z"/>
              <path d="M27.9 23.1h-7.8l-1.6 4.3h11l-1.6-4.3z"/>
              <path d="M26.2 6.7c-.1-.4-.5-.7-.9-.7h-2.6c-.4 0-.8.3-.9.7l-1.1 3h6.6l-1.1-3z"/>
              <path d="M21 12.5l-1.6 4.3h9.2L27 12.5h-6z"/>
              <path d="M33.9 38.7H14.1c-.6 0-1 .5-.8 1l.4 1.6c.1.4.5.7.9.7h18.8c.4 0 .8-.3.9-.7l.4-1.6c.2-.5-.2-1-.8-1z"/>
            </svg>
          </i>
        	<PopupText aria-live="Open in VLC">Open in VLC</PopupText>
        </ButtonObj>
    )
}

export default VLCButton
