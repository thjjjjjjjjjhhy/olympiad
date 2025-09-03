// auth.js
import { auth, provider, db } from "./firebase-init.js";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Render sign-in / user UI in the header
function renderAuthSlot(user) {
  const slot = document.getElementById("auth-slot");
  if (!slot) return;

  if (!user) {
    slot.innerHTML = `
      <button id="googleSignIn" style="border:1px solid #e5e7eb;border-radius:12px;padding:8px 12px;background:#fff;cursor:pointer;">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style="width:18px;vertical-align:middle;margin-right:6px"> Sign in with Google
      </button>`;
    document.getElementById("googleSignIn").onclick = async () => {
      try { await signInWithPopup(auth, provider); } catch (e) { alert("Sign-in failed: " + e.message); }
    };
  } else {
    const name = user.displayName || user.email || "Account";
    const photo = user.photoURL || "https://ui-avatars.com/api/?name="+encodeURIComponent(name);
    slot.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:8px">
        <img src="${photo}" alt="avatar" style="width:26px;height:26px;border-radius:50%;border:1px solid #e5e7eb">
        <span style="font-size:.9rem;color:#334155;">${name}</span>
        <button id="googleSignOut" class="secondary" style="border:1px solid #e5e7eb;border-radius:10px;background:#fff;color:#111;padding:6px 10px;cursor:pointer">Sign out</button>
      </span>`;
    document.getElementById("googleSignOut").onclick = async () => {
      try { await signOut(auth); } catch (e) { alert("Sign-out failed: " + e.message); }
    };
  }
}

// Cloud plan helpers
async function loadPlan() {
  const u = auth.currentUser;
  if (!u) return null;
  const ref = doc(db, "users", u.uid, "plans", "default");
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return data && data.studyPlanInput ? data.studyPlanInput : null;
}

async function savePlan(studyPlanInput) {
  const u = auth.currentUser;
  if (!u || !studyPlanInput) return;
  const ref = doc(db, "users", u.uid, "plans", "default");
  await setDoc(ref, { studyPlanInput, updatedAt: serverTimestamp() }, { merge: true });
}

window.olympAuth = { getUser: () => auth.currentUser, loadPlan, savePlan };

// React to sign-in/out; auto-load plan on timeline
onAuthStateChanged(auth, async (user) => {
  renderAuthSlot(user);

  const onTimeline = /timeline\.html(\?|$)/.test(location.pathname) || document.querySelector("#calendar");
  if (user && onTimeline) {
    try {
      const cloud = await loadPlan();
      if (cloud) {
        const localRaw = localStorage.getItem("studyPlanInput");
        const local = localRaw ? JSON.parse(localRaw) : null;
        const cloudT = Date.parse(cloud.generatedAt || 0) || 0;
        const localT = local ? (Date.parse(local.generatedAt || 0) || 0) : 0;
        if (cloudT > localT) {
          localStorage.setItem("studyPlanInput", JSON.stringify(cloud));
          location.replace(location.href);
        }
      }
    } catch (e) {
      console.warn("Could not load cloud plan:", e);
    }
  }
});

// After clicking Rebuild, save latest plan to cloud
document.addEventListener("click", () => {
  const input = (() => { try { return JSON.parse(localStorage.getItem("studyPlanInput")||"null"); } catch { return null; } })();
  if (input && window.olympAuth.getUser()) savePlan(input);
});
