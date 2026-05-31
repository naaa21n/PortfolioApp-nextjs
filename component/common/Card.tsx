export default function Card({
    children
   }:{
    children:React.ReactNode
   }){
    return(
     <div
      style={{
       background:"#fff",
       borderRadius:"24px",
       border:"1px solid #eef2ff",
       boxShadow:
         "0 10px 30px rgba(15,23,42,.06)",
       padding:"24px"
      }}
     >
      {children}
     </div>
    )
   }