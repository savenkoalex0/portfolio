const PI2 = Math.PI * 2;

function drawAnimatedWave(canvas, opts) {
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  let t = 0;
  const options = Object.assign(
    {
      waves: 3,
      speed: 0.008,
      amp: 40,
      freq: 0.012,
      colors: ["#00ff9d", "#7c4dff", "#ff3c5c"],
      bg: null,
      alpha: 0.6,
      thick: 1.5,
      barMode: false,
      barCount: 80,
      mirror: false
    },
    opts
  );

  function resize() {
    canvas.width = canvas.offsetWidth || canvas.clientWidth || 400;
    canvas.height = canvas.offsetHeight || canvas.clientHeight || 200;
  }

  function frame() {
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (options.bg) {
      ctx.fillStyle = options.bg;
      ctx.fillRect(0, 0, w, h);
    }

    if (options.barMode) {
      const barWidth = w / options.barCount;

      for (let i = 0; i < options.barCount; i += 1) {
        const value = Math.sin(i * 0.18 + t * 3) * Math.sin(i * 0.07 + t * 1.5);
        const barHeight = (Math.abs(value) * 0.5 + 0.05) * h * 0.8;
        const x = i * barWidth;
        const colorIndex = i % options.colors.length;
        const gradient = ctx.createLinearGradient(0, h / 2 - barHeight / 2, 0, h / 2 + barHeight / 2);

        gradient.addColorStop(0, options.colors[colorIndex] + "00");
        gradient.addColorStop(0.5, options.colors[colorIndex] + "cc");
        gradient.addColorStop(1, options.colors[colorIndex] + "00");

        ctx.fillStyle = gradient;
        ctx.fillRect(x + barWidth * 0.15, h / 2 - barHeight / 2, barWidth * 0.7, barHeight);
      }
    } else {
      for (let waveIndex = 0; waveIndex < options.waves; waveIndex += 1) {
        ctx.beginPath();

        const phase = (waveIndex / options.waves) * PI2;
        const amplitude = options.amp * (1 - waveIndex * 0.2);
        const centerY = h / 2 + (waveIndex - options.waves / 2) * (h * 0.05);

        for (let x = 0; x <= w; x += 2) {
          const y =
            centerY +
            Math.sin(x * options.freq + t + phase) * amplitude +
            Math.sin(x * options.freq * 2.1 + t * 1.3 + phase) * amplitude * 0.4;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        if (options.mirror) {
          const gradient = ctx.createLinearGradient(0, 0, 0, h);

          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();

          gradient.addColorStop(0, options.colors[waveIndex % options.colors.length] + "40");
          gradient.addColorStop(1, "transparent");

          ctx.fillStyle = gradient;
          ctx.fill();
        }

        ctx.strokeStyle = options.colors[waveIndex % options.colors.length];
        ctx.globalAlpha = options.alpha - waveIndex * 0.15;
        ctx.lineWidth = options.thick - waveIndex * 0.3;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    t += options.speed;
    requestAnimationFrame(frame);
  }

  resize();
  frame();
  window.addEventListener("resize", resize);
}

const headerCanvas = document.getElementById("waveCanvas");

if (headerCanvas) {
  headerCanvas.width = window.innerWidth;
  headerCanvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    headerCanvas.width = window.innerWidth;
    headerCanvas.height = window.innerHeight;
  });

  drawAnimatedWave(headerCanvas, {
    waves: 5,
    amp: 70,
    freq: 0.006,
    speed: 0.006,
    thick: 1.2,
    alpha: 0.35,
    colors: ["#00ff9d", "#7c4dff", "#ff3c5c", "#00cfff", "#ffb300"],
    mirror: true
  });
}

drawAnimatedWave(document.getElementById("aboutWave"), {
  barMode: true,
  barCount: 60,
  bg: "#1a1a1a",
  colors: ["#00ff9d", "#7c4dff", "#ff3c5c"],
  alpha: 1
});

const workConfigs = [
  { colors: ["#00ff9d", "#00cfff"], amp: 50, freq: 0.008, waves: 4, bg: "#0d1f1a", barMode: false },
  { colors: ["#7c4dff", "#ff3c5c"], amp: 35, freq: 0.015, waves: 3, bg: "#150d20", barMode: false },
  { colors: ["#ff9d00", "#ff3c5c"], amp: 25, freq: 0.02, waves: 2, bg: "#1f1200", barMode: false },
  { colors: ["#00cfff", "#7c4dff"], barMode: true, barCount: 40, bg: "#0d1520" },
  { colors: ["#00ff9d", "#00cfff", "#7c4dff"], barMode: true, barCount: 50, bg: "#101f18" }
];

for (let i = 1; i <= 5; i += 1) {
  const canvas = document.getElementById(`ww${i}`);

  if (canvas) {
    canvas.width = canvas.offsetWidth || 400;
    canvas.height = canvas.offsetHeight || 200;
    drawAnimatedWave(canvas, workConfigs[i - 1]);
  }
}

drawAnimatedWave(document.getElementById("contactWave"), {
  waves: 4,
  amp: 35,
  freq: 0.005,
  speed: 0.004,
  thick: 1,
  alpha: 0.5,
  colors: ["#00ff9d", "#7c4dff", "#ff3c5c", "#00cfff"],
  mirror: false
});

const videoModal = document.getElementById("videoModal");
const videoModalFrame = document.getElementById("videoModalFrame");
const videoModalTitle = document.getElementById("videoModalTitle");
const videoTriggers = document.querySelectorAll("[data-video-url]");
const videoModalCloseButtons = document.querySelectorAll("[data-close-video-modal]");

function getYouTubeEmbedUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);
    const isYouTubeHost =
      parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtu.be");

    if (!isYouTubeHost) {
      return url;
    }

    let videoId = "";

    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.replace("/", "");
    } else if (parsedUrl.pathname === "/watch") {
      videoId = parsedUrl.searchParams.get("v") || "";
    } else if (parsedUrl.pathname.startsWith("/embed/")) {
      videoId = parsedUrl.pathname.split("/embed/")[1] || "";
    } else if (parsedUrl.pathname.startsWith("/shorts/")) {
      videoId = parsedUrl.pathname.split("/shorts/")[1] || "";
    }

    if (!videoId) {
      return "";
    }

    const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);

    embedUrl.searchParams.set("autoplay", "1");
    embedUrl.searchParams.set("rel", "0");

    if (window.location.protocol === "http:" || window.location.protocol === "https:") {
      embedUrl.searchParams.set("origin", window.location.origin);
    }

    return embedUrl.toString();
  } catch {
    return "";
  }
}

function openVideoModal(url, title) {
  if (!videoModal || !videoModalFrame || !videoModalTitle) {
    return;
  }

  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return;
  }

  videoModalFrame.src = embedUrl;
  videoModalTitle.textContent = title || "Project video";
  videoModal.classList.add("is-open");
  videoModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeVideoModal() {
  if (!videoModal || !videoModalFrame) {
    return;
  }

  videoModal.classList.remove("is-open");
  videoModal.setAttribute("aria-hidden", "true");
  videoModalFrame.src = "";
  document.body.style.overflow = "";
}

videoTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openVideoModal(trigger.dataset.videoUrl, trigger.dataset.videoTitle);
  });
});

videoModalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeVideoModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeVideoModal();
  }
});
