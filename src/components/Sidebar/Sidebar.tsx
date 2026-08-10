// import { motion } from 'framer-motion'
// import { PanelLeftClose, PanelLeftOpen, TerminalSquare } from 'lucide-react'
// import { useAppContext } from '../../contexts/AppContext'

// const Sidebar = () => {
//   const { sidebarOpen, setSidebarOpen } = useAppContext()

//   return (
//     <motion.aside
//       initial={false}
//       animate={{ width: sidebarOpen ? 280 : 86 }}
//       transition={{ type: 'spring', stiffness: 260, damping: 26 }}
//       className="sidebar"
//     >
//       <div className="d-flex align-items-center justify-content-between mb-4">
//         <div className="d-flex align-items-center gap-2">
//           <div className="rounded-3 p-2" style={{ background: '#ecfdf5' }}>
//             <TerminalSquare size={20} color="#10A37F" />
//           </div>
//           {sidebarOpen && <span className="fw-semibold">Playground</span>}
//         </div>
//         <button
//           type="button"
//           onClick={() => setSidebarOpen((prev) => !prev)}
//           className="btn btn-link p-0 text-light"
//           aria-label="Toggle sidebar"
//         >
//           {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
//         </button>
//       </div>
// {/* 
//       {sidebarOpen && (
//         <div className="mt-3">
//           <div className="rounded-3 p-3" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
//             <p className="small text-secondary mb-1">Current workspace</p>
//             <h6 className="mb-0">SIEM Assistant</h6>
//             <p className="small text-muted mt-2">Wazuh query generation and execution</p>
//           </div>
//         </div>
//       )} */}
//     </motion.aside>
//   )
// }

// export default Sidebar
import { motion } from 'framer-motion'
import {
  PanelLeftClose,
  PanelLeftOpen,
  TerminalSquare
} from 'lucide-react'
import { useAppContext } from '../../contexts/AppContext'

const Sidebar = () => {

  const { sidebarOpen, setSidebarOpen } = useAppContext()

  return (

    <>

      <style>{`

        /* =========================================
           SIEM SIDEBAR
        ========================================= */

        .sidebar {

          position: relative;

          min-height: 100vh;

          padding: 20px 16px;

          background:
          radial-gradient(
            circle at top left,
            #164e9c,
            #020617 65%
          );

          color: #ffffff;

          border-right:
          1px solid
          rgba(59,130,246,0.35);

          box-shadow:
          5px 0 25px
          rgba(0,0,0,0.25);

          overflow: hidden;

          z-index: 10;

        }


        /* Cyber grid */

        .sidebar::before {

          content: "";

          position: absolute;

          inset: 0;

          background-image:

          linear-gradient(
            rgba(59,130,246,0.08) 1px,
            transparent 1px
          ),

          linear-gradient(
            90deg,
            rgba(59,130,246,0.08) 1px,
            transparent 1px
          );

          background-size: 35px 35px;

          pointer-events: none;

          z-index: 0;

        }


        /* Keep sidebar content above grid */

        .sidebar > * {

          position: relative;

          z-index: 2;

        }


        /* =========================================
           SIDEBAR LOGO
        ========================================= */

        .sidebar .rounded-3 {

          background:
          linear-gradient(
            135deg,
            #2563eb,
            #06b6d4
          ) !important;

          border:
          1px solid
          rgba(96,165,250,0.45);

          box-shadow:

          0 0 15px
          rgba(14,165,233,0.45);

          display: flex;

          align-items: center;

          justify-content: center;

        }


        .sidebar .rounded-3 svg {

          color: #ffffff !important;

          filter:
          drop-shadow(
            0 0 5px
            rgba(255,255,255,0.6)
          );

        }


        /* =========================================
           SIDEBAR TITLE
        ========================================= */

        .sidebar .fw-semibold {

          color: #ffffff;

          font-size: 16px;

          letter-spacing: 0.5px;

          text-shadow:

          0 0 10px
          rgba(59,130,246,0.6);

        }


        /* =========================================
           TOGGLE BUTTON
        ========================================= */

        .sidebar button.btn-link {

          width: 34px;

          height: 34px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          color: #bfdbfe !important;

          text-decoration: none;

          transition: 0.25s;

        }


        .sidebar button.btn-link:hover {

          color: #ffffff !important;

          background:
          rgba(37,99,235,0.25);

          box-shadow:

          0 0 15px
          rgba(14,165,233,0.35);

        }


        .sidebar button.btn-link svg {

          transition: 0.25s;

        }


        .sidebar button.btn-link:hover svg {

          filter:

          drop-shadow(
            0 0 6px
            rgba(14,165,233,0.9)
          );

        }


        /* =========================================
           COLLAPSED SIDEBAR
        ========================================= */

        .sidebar[style*="width: 86px"] {

          padding-left: 12px;

          padding-right: 12px;

        }


        /* =========================================
           MOBILE
        ========================================= */

        @media(max-width:768px){

          .sidebar {

            padding: 16px 12px;

          }

        }

      `}</style>


      <motion.aside

        initial={false}

        animate={{
          width: sidebarOpen ? 280 : 86
        }}

        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 26
        }}

        className="sidebar"

      >

        <div className="d-flex align-items-center justify-content-between mb-4">

          <div className="d-flex align-items-center gap-2">

            <div
              className="rounded-3 p-2"
              style={{
                background: '#ecfdf5'
              }}
            >

              <TerminalSquare
                size={20}
                color="#10A37F"
              />

            </div>

            {
              sidebarOpen &&
              <span className="fw-semibold">
                Playground
              </span>
            }

          </div>


          <button

            type="button"

            onClick={() =>
              setSidebarOpen(
                (prev) => !prev
              )
            }

            className="btn btn-link p-0 text-light"

            aria-label="Toggle sidebar"

          >

            {
              sidebarOpen
                ?
                <PanelLeftClose size={18} />
                :
                <PanelLeftOpen size={18} />
            }

          </button>

        </div>

      </motion.aside>

    </>

  )

}

export default Sidebar