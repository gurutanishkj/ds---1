# PATHSHIFT – Interactive Shortest Path & Weight Transformation Visualizer

> **A modern, interactive graph algorithm learning platform and CSE laboratory project demonstrating why adding a uniform constant $k$ to all edge weights does NOT necessarily preserve the shortest-path spanning tree.**

---

## 🌟 Core Theoretical Concept

Given an undirected weighted graph $G = (V, E)$ and a shortest-path spanning tree rooted at source vertex $s$, if every edge weight is increased by a constant $k \ge 0$ ($w'(e) = w(e) + k$):

$$\mathbf{W'(P) = \sum_{e \in P} (w(e) + k) = W(P) + |P| \cdot k}$$

Because paths with more edges receive a larger additional cumulative penalty $|P| \cdot k$ than paths with fewer edges, the relative cost ordering of candidate paths can invert once $k$ exceeds the algebraic break-even point:

$$k^* = \frac{W(P_2) - W(P_1)}{|P_1| - |P_2|}$$

Therefore, adding a positive constant $k$ to every edge **does NOT necessarily preserve** the shortest-path spanning tree (SPT).

*(In contrast, a Minimum Spanning Tree (MST) IS always preserved because every spanning tree has exactly $|V| - 1$ edges).*

---

## 🚀 Key Features

1. **Interactive Graph Canvas (React Flow)**:
   - Full vertex creation (click canvas or button), automatic naming (A, B, C...), renaming, dragging, and deletion.
   - Interactive edge drawing with prompt/modal for edge weights $w(e) \ge 0$.
   - Live dual-weight rendering on every edge ($w(e) \to w(e) + k$).
   - Color-coded glowing highlights for Shortest Path (amber), Tree Edges (cyan), Source (emerald), and Destination (crimson).

2. **Dijkstra Algorithm from Scratch**:
   - Zero third-party algorithm libraries; pure, modular TypeScript implementation.
   - Step-by-step interactive player: Start, Pause, Resume, Next Step, Step Back, Auto-play, and Speed control (Slow, Medium, Fast).
   - Real-time step execution log showing vertex selection, tentative distances, and edge relaxation equations.
   - Live Distance Table updating distances, predecessors, and visited status.

3. **$k$ Weight Transformation Engine**:
   - Stepper (`[-] 0 [+]`) and continuous slider ($k = 0 \dots 20$).
   - Instant recomputation without page reload.
   - Dynamic indicators for tree mutation: "Tree Changed: YES / NO" and number of altered edges.

4. **Path-Switch Detector & "Explain Change" Engine**:
   - Computes the exact threshold $k^*$ directly from the current graph.
   - Detailed modal breakdown with arithmetic substitution, hop-penalty comparison, and formal proof.

5. **Split-Screen Before vs. After View**:
   - Side-by-side structural comparison of baseline graph ($k=0$) vs. modified graph ($k > 0$).
   - Detailed edge mutation metrics: retained, added, and removed edges.

6. **K vs. Shortest Path Cost Chart (Recharts)**:
   - Responsive multi-line chart showing path cost trajectories as a function of $k$.
   - Slope equals edge count $m = |P|$. Crossover points visually identified.

7. **Preset & Counterexample Generators**:
   - 🎲 **Counterexample Generator**: Automatically creates valid weighted graphs where shortest paths flip.
   - 🎲 **Random Graph Generator**: Generates guaranteed-connected graphs with customizable vertex count, min/max weights, and density.

8. **Educational Curriculum & Modes**:
   - **Learn Mode**: 10 interactive curriculum topics with mini interactive widgets and practice checks.
   - **Challenge Mode**: 5 progressive algorithmic puzzles with live testing, hints, and confetti celebration.
   - **Quiz Mode**: 10 conceptual multiple-choice questions with instant feedback and score tracking.
   - **Experiment Mode**: Dedicated laboratory bench with batch $k$-sweep table.
   - **Saved Graphs & Reports**: LocalStorage persistence, JSON export/import, PNG snapshot, and printable formal reports.
   - **🎬 Demo Tour**: 7-step guided walkthrough for lab demonstrations.
   - **📽️ Presentation Mode**: Fullscreen projector presentation deck for viva voce evaluations.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite 8 (TypeScript with strict verbatim module syntax)
- **Styling**: Tailwind CSS v4 + Vanilla CSS animations & glassmorphism
- **Graph Engine**: `@xyflow/react` (React Flow v12)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: Zustand
- **Animations & Effects**: Framer Motion + Canvas-Confetti
- **Exporting**: `html-to-image`

---

## 💻 Running Locally

```bash
# Clone the repository
git clone <repo-url>
cd ds

# Install dependencies
npm install --legacy-peer-deps

# Start Vite development server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:5173/` in your browser.
