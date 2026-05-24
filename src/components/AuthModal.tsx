import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { auth, db } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { EVAnimatedLogo } from "./EVAnimatedLogo";
import { DEFAULT_DISTRICTS_DATA } from "../data/districts";

interface AuthModalProps {
  onClose: () => void;
  addToast: (msg: string) => void;
  handleGoogleLogin: () => void;
  districtsData?: Record<string, string[]>;
}

export function AuthModal({
  onClose,
  addToast,
  handleGoogleLogin,
  districtsData = DEFAULT_DISTRICTS_DATA,
}: AuthModalProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [state, setState] = useState("Telangana");
  const [district, setDistrict] = useState("");
  const [mandal, setMandal] = useState("");
  const [village, setVillage] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [designation, setDesignation] = useState("");

  const mandals = district ? districtsData[district] || [] : [];

  const getFriendlyError = (err: any) => {
    const code = err.code;
    if (code === "auth/user-not-found") return "User not found";
    if (code === "auth/wrong-password") return "Wrong password";
    if (code === "auth/invalid-email") return "Invalid email address";
    if (code === "auth/email-already-in-use") return "Email already in use";
    return err.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (!isSignup) {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else {
        if (
          !username ||
          !email ||
          !password ||
          !name ||
          !surname ||
          (gender !== "Female" && !mobile)
        ) {
          addToast("Please fill all required fields (*)");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          addToast("Passwords do not match");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          addToast("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const lowerUsername = username.toLowerCase().trim();
        const usernameDoc = await getDoc(doc(db, "usernames", lowerUsername));
        if (usernameDoc.exists()) {
          addToast("Username already taken. Choose another.");
          setLoading(false);
          return;
        }

        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = cred.user;
        await updateProfile(user, { displayName: username });

        await setDoc(doc(db, "usernames", lowerUsername), { uid: user.uid });

        await setDoc(doc(db, "users", user.uid), {
          surname,
          name,
          username,
          gender,
          state,
          district,
          mandal,
          village,
          designation,
          mobile,
          email,
          time: Date.now(),
        });

        if (designation === "Citizen") {
          Swal.fire({
            title: "సిటిజన్ గారికి నమస్కారం",
            text: "ప్రస్తుతం ఈ వేదిక Webportal సిటిజన్ సర్వీస్ ఇంకా అందుబాటులోకి రాలేదు. రాగానే మీ మొబైల్ నెంబర్ కి మెసేజ్ లేదా ఇమెయిల్ ద్వారా మీకు సమాచారం ఇవ్వడం జరుగుతుంది.",
            icon: "info",
            confirmButtonText: "సరే (OK)",
            confirmButtonColor: "#0d3b66",
          });
        } else {
          addToast("Account created successfully!");
        }
        onClose();
      }
    } catch (err: any) {
      addToast(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[11000] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[450px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200/50"
      >
        <div className="bg-gradient-to-b from-[#0f2e4a] to-[#0a1f33] p-5 text-white text-center relative flex flex-col items-center border-b border-indigo-950/20 shadow-inner">
          <button
            aria-label="Close auth modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90"
          >
            <X size={16} />
          </button>

          <div className="mb-2 bg-white/5 p-2 rounded-full border border-white/10 shadow-md">
            <EVAnimatedLogo size={36} />
          </div>

          <h2
            className="text-xl sm:text-2xl font-black uppercase tracking-wider leading-none mb-1 flex items-center gap-1"
            style={{
              color: "#fbe947",
              fontFamily: '"Arial Black", Impact, sans-serif',
            }}
          >
            E<span style={{ color: "#facc15" }}>-</span>VEDHIKA
          </h2>
          <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.22em] pl-0.5">
            Access Your Portal
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 bg-white custom-scrollbar">
          <div className="mb-5 text-center">
            <h3 className="text-lg sm:text-xl font-black text-[#0f2e4a] tracking-tight">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {isSignup
                ? "Fill in your details to get started."
                : "Sign in with your credentials."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                      Surname <span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="Surname"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                      Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                    Username / Display Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Display name"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => {
                        setGender(e.target.value);
                        if (e.target.value === "Female") setMobile("");
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm cursor-pointer"
                    >
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  {gender !== "Female" && (
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                        Mobile No <span className="text-rose-500">*</span>
                      </label>
                      <input
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Phone"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                      State
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm cursor-pointer"
                    >
                      <option>Telangana</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                      District <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setMandal("");
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm cursor-pointer"
                    >
                      <option value="">Select District</option>
                      {Object.keys(districtsData)
                        .sort()
                        .map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                      Mandal
                    </label>
                    <select
                      value={mandal}
                      onChange={(e) => setMandal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                      disabled={!district}
                    >
                      <option value="">Select Mandal</option>
                      {mandals.map((m, idx) => (
                        <option key={`${m}_${idx}`} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                      Village / GP
                    </label>
                    <input
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="Enter Village"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                    Designation
                  </label>
                  <input
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Type Designation"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm"
                  />
                </div>
              </>
            )}

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="email@example.com"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm"
              />
            </div>

            <div className={isSignup ? "grid grid-cols-2 gap-3" : "flex flex-col"}>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm"
                />
              </div>
              {isSignup && (
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 pl-0.5">
                    Confirm Password
                  </label>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none hover:bg-slate-100/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm"
                  />
                </div>
              )}
            </div>

            <button
              aria-label={isSignup ? "Register Now" : "Sign In Now"}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-800 text-white py-3 px-5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/15 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-50 disabled:transform-none flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin text-white" size={15} />
              ) : isSignup ? (
                "Register Now"
              ) : (
                "Sign In Now"
              )}
            </button>
          </form>

          {!isSignup && (
            <>
              <div className="my-4 flex items-center gap-3">
                <div className="flex-1 h-[1px] bg-slate-200"></div>
                <span className="text-[10px] font-extrabold text-slate-400 tracking-widest">
                  OR
                </span>
                <div className="flex-1 h-[1px] bg-slate-200"></div>
              </div>

              <button
                aria-label="Continue with Google"
                type="button"
                onClick={handleGoogleLogin}
                className="w-full border-2 border-slate-200 hover:border-slate-300 py-2.5 rounded-xl font-black text-slate-700 hover:text-slate-900 text-xs uppercase flex items-center justify-center gap-2.5 hover:bg-slate-50/50 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
              <div className="mt-2 text-center">
                <p className="text-[10px] text-slate-400 font-bold leading-tight">
                  లాగిన్ ఆలస్యం అయితే పైన ఉన్న బాణం ↗ గుర్తుపై క్లిక్ చేసి <br/> 
                  కొత్త ట్యాబ్‌లో ఓపెన్ చేయండి. అప్పుడు త్వరగా అవుతుంది.
                </p>
              </div>
            </>
          )}

          <div className="mt-5 text-center pb-2">
            <button
              aria-label={isSignup ? "Switch to Sign In" : "Switch to Sign Up"}
              onClick={() => setIsSignup(!isSignup)}
              className="text-[#0f2e4a] hover:text-indigo-600 font-extrabold text-xs uppercase tracking-wide transition-colors"
            >
              {isSignup
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
