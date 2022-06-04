const iconPlus =
    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="currentColor"
        className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
        <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
    </svg>;

const iconUser =
    <svg className="bi bi-person-square" width="1.2em" height="1.2em" viewBox="0 0 16 16"
        fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd"
            d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z"
            clipRule="evenodd" />
        <path fillRule="evenodd"
            d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd" />
    </svg>;

const iconCode =
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-code" viewBox="0 0 16 16">
        <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z" />
    </svg>

const iconLogin =
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
        className="bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path fillRule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
    </svg>;

const iconEdit =
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" /* fill="#f0cd7c" */ className="bi bi-pencil-square" viewBox="0 0 16 16">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
    </svg>;

const iconDelete =
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" /* fill="#e4605e" */ className="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
    </svg>;

const iconOutCode = <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-code-slash" viewBox="0 0 16 16">
    <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
</svg>

const survey = <img width='30' height='30' src="data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTQzNS41MzYgNTEyaC0yOTcuMTY3Yy04LjU0MSAwLTE1LjQ2NC02LjkyNC0xNS40NjQtMTUuNDY0di0zOTMuNTA2YzAtOC41NDEgNi45MjQtMTUuNDY0IDE1LjQ2NC0xNS40NjRoMjk3LjE2NmM4LjU0MSAwIDE1LjQ2NCA2LjkyNCAxNS40NjQgMTUuNDY0djM5My41MDZjLjAwMSA4LjU0LTYuOTIzIDE1LjQ2NC0xNS40NjMgMTUuNDY0eiIgZmlsbD0iI2JkYmRiZCIvPjxwYXRoIGQ9Im00MDQuNTgzIDQ2OC4yMTdoLTI5Ny4xNjZjLTguNTQxIDAtMTUuNDY0LTYuOTI0LTE1LjQ2NC0xNS40NjR2LTM5My41MDZjMC04LjU0MSA2LjkyNC0xNS40NjQgMTUuNDY0LTE1LjQ2NGgyOTcuMTY2YzguNTQxIDAgMTUuNDY0IDYuOTI0IDE1LjQ2NCAxNS40NjR2MzkzLjUwNmMuMDAxIDguNTQxLTYuOTIzIDE1LjQ2NC0xNS40NjQgMTUuNDY0eiIgZmlsbD0iI2Q0ZDRkNCIvPjxwYXRoIGQ9Im0zNzMuNjMxIDQyNC40MzVoLTI5Ny4xNjdjLTguNTQxIDAtMTUuNDY0LTYuOTI0LTE1LjQ2NC0xNS40NjR2LTM5My41MDdjMC04LjU0IDYuOTI0LTE1LjQ2NCAxNS40NjQtMTUuNDY0aDI5Ny4xNjZjOC41NDEgMCAxNS40NjQgNi45MjQgMTUuNDY0IDE1LjQ2NHYzOTMuNTA2Yy4wMDEgOC41NDEtNi45MjIgMTUuNDY1LTE1LjQ2MyAxNS40NjV6IiBmaWxsPSIjZjVmNWY1Ii8+PHBhdGggZD0ibTM1OC4xNDMgMHY0MjQuNDM1aDE1LjQ3NmM4LjU0NyAwIDE1LjQ3Ni02LjkxOCAxNS40NzYtMTUuNDUzdi0zOTMuNTI5YzAtOC41MzUtNi45MjktMTUuNDUzLTE1LjQ3Ni0xNS40NTN6IiBmaWxsPSIjZTZlNmU2Ii8+PHBhdGggZD0ibTE3MS4wMSAxNzcuNzA2aC01My41NjljLTIuMjc2IDAtNC4xMjEtMS44NDUtNC4xMjEtNC4xMjF2LTUzLjU2OWMwLTIuMjc2IDEuODQ1LTQuMTIxIDQuMTIxLTQuMTIxaDUzLjU2OWMyLjI3NiAwIDQuMTIxIDEuODQ1IDQuMTIxIDQuMTIxdjUzLjU2OWMwIDIuMjc2LTEuODQ1IDQuMTIxLTQuMTIxIDQuMTIxeiIgZmlsbD0iI2ZmM2Q3YSIvPjxwYXRoIGQ9Im0xNzEuMDEgMjc3LjYzNGgtNTMuNTY5Yy0yLjI3NiAwLTQuMTIxLTEuODQ1LTQuMTIxLTQuMTIxdi01My41NjljMC0yLjI3NiAxLjg0NS00LjEyMSA0LjEyMS00LjEyMWg1My41NjljMi4yNzYgMCA0LjEyMSAxLjg0NSA0LjEyMSA0LjEyMXY1My41NjljMCAyLjI3Ni0xLjg0NSA0LjEyMS00LjEyMSA0LjEyMXoiIGZpbGw9IiM4Y2YyZmYiLz48cGF0aCBkPSJtMTcxLjAxIDM3Ny41NjFoLTUzLjU2OWMtMi4yNzYgMC00LjEyMS0xLjg0NS00LjEyMS00LjEyMXYtNTMuNTY5YzAtMi4yNzYgMS44NDUtNC4xMjEgNC4xMjEtNC4xMjFoNTMuNTY5YzIuMjc2IDAgNC4xMjEgMS44NDUgNC4xMjEgNC4xMjF2NTMuNTY5YzAgMi4yNzYtMS44NDUgNC4xMjEtNC4xMjEgNC4xMjF6IiBmaWxsPSIjZmZjYTI4Ii8+PGcgZmlsbD0iIzc0ODhlZCI+PHBhdGggZD0ibTIxMy4yNDggMTM1Ljc1OGgxMjMuNjIyYzQuMTQzIDAgNy41LTMuMzU3IDcuNS03LjVzLTMuMzU3LTcuNS03LjUtNy41aC0xMjMuNjIyYy00LjE0MiAwLTcuNSAzLjM1Ny03LjUgNy41czMuMzU3IDcuNSA3LjUgNy41eiIvPjxwYXRoIGQ9Im0zMzYuODY5IDE1My43MjRoLTEyMy42MjFjLTQuMTQyIDAtNy41IDMuMzU3LTcuNSA3LjVzMy4zNTggNy41IDcuNSA3LjVoMTIzLjYyMmM0LjE0MyAwIDcuNS0zLjM1NyA3LjUtNy41cy0zLjM1OC03LjUtNy41MDEtNy41eiIvPjxwYXRoIGQ9Im0zMzYuODY5IDIyMC42ODZoLTEyMy42MjFjLTQuMTQyIDAtNy41IDMuMzU3LTcuNSA3LjVzMy4zNTggNy41IDcuNSA3LjVoMTIzLjYyMmM0LjE0MyAwIDcuNS0zLjM1NyA3LjUtNy41cy0zLjM1OC03LjUtNy41MDEtNy41eiIvPjxwYXRoIGQ9Im0zMzYuODY5IDI1My42NTFoLTEyMy42MjFjLTQuMTQyIDAtNy41IDMuMzU3LTcuNSA3LjVzMy4zNTggNy41IDcuNSA3LjVoMTIzLjYyMmM0LjE0MyAwIDcuNS0zLjM1NyA3LjUtNy41cy0zLjM1OC03LjUtNy41MDEtNy41eiIvPjxwYXRoIGQ9Im0zMzYuODY5IDMyMC42MTJoLTEyMy42MjFjLTQuMTQyIDAtNy41IDMuMzU3LTcuNSA3LjVzMy4zNTggNy41IDcuNSA3LjVoMTIzLjYyMmM0LjE0MyAwIDcuNS0zLjM1NyA3LjUtNy41cy0zLjM1OC03LjUtNy41MDEtNy41eiIvPjxwYXRoIGQ9Im0zMzYuODY5IDM1My41NzhoLTEyMy42MjFjLTQuMTQyIDAtNy41IDMuMzU3LTcuNSA3LjVzMy4zNTggNy41IDcuNSA3LjVoMTIzLjYyMmM0LjE0MyAwIDcuNS0zLjM1NyA3LjUtNy41cy0zLjM1OC03LjUtNy41MDEtNy41eiIvPjwvZz48cGF0aCBkPSJtMjk3LjcyMiA3Mi42MjhoLTE0Mi4xNjVjLTkuOTU3IDAtMTguMDI4LTguMDcxLTE4LjAyOC0xOC4wMjggMC05Ljk1NyA4LjA3MS0xOC4wMjggMTguMDI4LTE4LjAyOGgxNDIuMTY1YzkuOTU3IDAgMTguMDI4IDguMDcxIDE4LjAyOCAxOC4wMjggMCA5Ljk1Ni04LjA3MSAxOC4wMjgtMTguMDI4IDE4LjAyOHoiIGZpbGw9IiM4YzllZmYiLz48cGF0aCBkPSJtMTk5LjM3OCAxMDkuNDgxYy0yLjY4OS0zLjE1LTcuNDIzLTMuNTI0LTEwLjU3NC0uODM1bC0zNi43NSAzMS4zNzEtNy40NjktOC4wOTFjLTIuODA5LTMuMDQzLTcuNTU0LTMuMjMzLTEwLjU5OC0uNDI0cy0zLjIzNCA3LjU1NC0uNDI0IDEwLjU5OGwxMi4zNjIgMTMuMzkzYzEuNDc2IDEuNTk5IDMuNDkgMi40MTMgNS41MTQgMi40MTMgMS43MjUgMCAzLjQ1Ny0uNTkyIDQuODY3LTEuNzk2bDQyLjIzNy0zNi4wNTZjMy4xNTEtMi42ODkgMy41MjQtNy40MjIuODM1LTEwLjU3M3oiIGZpbGw9IiM4YzllZmYiLz48L3N2Zz4=" alt="Survey-Icon"/>

const arrowUp =<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up" viewBox="0 0 16 16">
<path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
</svg>

const arrowDown = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down" viewBox="0 0 16 16">
<path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
</svg>;
export { iconPlus, iconUser, iconLogin, iconEdit, iconDelete, iconOutCode, iconCode, survey, arrowUp, arrowDown };