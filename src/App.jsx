import { useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [name, setName] = useState("");
  const [stage, setStage] = useState("confess"); // "confess" | "proposal" | "commit"
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const moveNoButton = () => {
    const randX = (Math.random() - 0.5) * 300; // range: -150 to 150
    const randY = (Math.random() - 0.5) * 200; // range: -100 to 100
    setNoPos({ x: randX, y: randY });
  };

  const fakeApi = async (url, payload) => {
    await new Promise((r) => setTimeout(r, 1200)); // simulate network delay

    if (url === "/api/relationship/confess") {
      if (payload.name.trim().toLowerCase() === "chiara") {
        return {
          success: true,
          message: "💌 Will you be my forever, Chiara?",
        };
      } else {
        return {
          success: false,
          message: "😢 Sorry... my heart only belongs to Chiara.",
        };
      }
    }

    if (url === "/api/relationship/commit" && payload.accepted) {
      return {
        success: true,
        message: "💖 You and Chiara are now officially together! 💍✨",
      };
    }

    return { success: false, message: "💔 She walked away..." };
  };

  const confess = async () => {
    if (!name.trim()) {
      setMessage("Please enter your name first 🥺");
      return;
    }

    setLoading(true);
    setMessage("");

    const response = await fakeApi("/api/relationship/confess", { name });

    if (response.success) {
      setMessage(response.message);
      setStage("proposal");
    } else {
      setMessage(response.message);
    }

    setLoading(false);
  };

  const acceptProposal = async () => {
    setLoading(true);
    setMessage("");

    const response = await fakeApi("/api/relationship/commit", {
      accepted: true,
    });

    setMessage(response.message);
    setStage("commit");
    setLoading(false);
  };

  return (
    <div className="relative flex items-center w-screen h-screen justify-center bg-linear-to-br from-pink-200 via-rose-300 to-rose-500 text-white text-center overflow-hidden">
      {/* Floating hearts animation */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{
            y: "100vh",
            x: Math.random() * window.innerWidth,
            opacity: 0,
          }}
          animate={{
            y: -100,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          ❤️
        </motion.div>
      ))}

      {/* Main centered card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center"
      >
        {stage === "confess" && (
          <>
            <h1 className="text-4xl font-extrabold mb-3">Hey 💕</h1>
            <p className="text-lg text-pink-100 mb-6">
              Hi, bub can you please enter your name?
            </p>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-gray-800 px-4 py-2 rounded-2xl w-full mb-4 text-center focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your name 💌"
            />

            <button
              onClick={confess}
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-2xl font-semibold shadow-lg transition transform hover:scale-105 disabled:opacity-70"
            >
              {loading ? "Sending..." : "Confess 💌"}
            </button>
          </>
        )}

        {stage === "proposal" && (
          <>
            <h1 className="text-3xl font-bold mb-6">{message}</h1>
            <div className="flex gap-4 justify-center">
              <button
                onClick={acceptProposal}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl font-semibold shadow-lg transition hover:scale-105 disabled:opacity-70"
              >
                {loading ? "Processing..." : "Yes 💍"}
              </button>
              <motion.button
                onHoverStart={moveNoButton}
                animate={{ x: noPos.x, y: noPos.y }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="bg-gray-400 hover:bg-gray-500 px-6 py-3 rounded-2xl font-semibold shadow-lg transition hover:scale-95"
              >
                No 😢
              </motion.button>
            </div>
          </>
        )}

        {stage === "commit" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <h2 className="text-3xl font-bold mb-4">{message}</h2>
            <button
              onClick={() => {
                setStage("confess");
                setMessage("");
                setName("");
              }}
              className="bg-pink-600 hover:bg-pink-700 px-6 py-2 rounded-2xl font-semibold shadow-lg transition hover:scale-105"
            >
              💖 Restart
            </button>
          </motion.div>
        )}

        {message && stage === "confess" && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-lg text-white font-medium"
          >
            {message}
          </motion.p>
        )}
      </motion.div>

      <p className="absolute bottom-4 text-pink-100 text-sm">
        💗 Made with love by a shy backend dev 💗
      </p>
    </div>
  );
}

export default App;
