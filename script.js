let currentSize = 16;

document.querySelectorAll(".inc-font").forEach(function(btn) {
  btn.onclick = function() {
    currentSize = Math.min(currentSize + 1, 22);
    document.body.style.fontSize = currentSize + "px";
  };
});

document.querySelectorAll(".dec-font").forEach(function(btn) {
  btn.onclick = function() {
    currentSize = Math.max(currentSize - 1, 13);
    document.body.style.fontSize = currentSize + "px";
  };
});

document.querySelectorAll(".toggle-mode").forEach(function(btn) {
  btn.onclick = function() {
    document.body.classList.toggle("light-mode");
  };
});

document.querySelectorAll(".read-page").forEach(function(btn) {
  btn.onclick = function() {
    speechSynthesis.cancel();
    const t = document.querySelector("main")?.innerText || document.body.innerText;
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "ar-SA";
    speechSynthesis.speak(u);
  };
});

document.querySelectorAll(".stop-read").forEach(function(btn) {
  btn.onclick = function() {
    speechSynthesis.cancel();
  };
});

document.querySelectorAll(".tool, .book-link, .submit-btn, .card, .mini-card").forEach(function(el) {
  el.addEventListener("mouseover", function() {
    el.style.transform = "translateY(-2px)";
  });
  el.addEventListener("mouseout", function() {
    el.style.transform = "";
  });
});

const normalForm = document.getElementById("booking-form");
if (normalForm) {
  normalForm.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("تم تأكيد حجزك");
    window.location.href = "index.html";
  });
}

const packageForm = document.getElementById("package-booking-form");
if (packageForm) {
  packageForm.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("تم تأكيد حجز الحزمة");
    window.location.href = "index.html";
  });
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault(); // يمنع إعادة تحميل الصفحة

    alert("تم إرسال رسالتك بنجاح ✅");

    contactForm.reset(); // يفرغ الحقول
  });
}

function createSearchBar() {
  const topSection = document.querySelector('.top-section');
  const main = document.querySelector('main');
  if (!topSection || !main || document.querySelector('.search-wrap')) {
    return;
  }

  const searchWrap = document.createElement('div');
  searchWrap.className = 'search-wrap';
  searchWrap.innerHTML = `
    <div class="search-box">
      <input type="search" class="page-search-input" placeholder="ابحث داخل هذه الصفحة">
      <button type="button" class="search-btn">بحث</button>
      <button type="button" class="search-clear">مسح</button>
      <div class="search-status">اكتب كلمة وسيتم تمييزها داخل الصفحة.</div>
    </div>
  `;

  topSection.insertAdjacentElement('afterend', searchWrap);

  const input = searchWrap.querySelector('.page-search-input');
  const searchBtn = searchWrap.querySelector('.search-btn');
  const clearBtn = searchWrap.querySelector('.search-clear');
  const status = searchWrap.querySelector('.search-status');

  function clearHighlights() {
    document.querySelectorAll('.search-highlight').forEach(function(mark) {
      const parent = mark.parentNode;
      if (!parent) {
        return;
      }
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  function shouldSkipNode(node) {
    const parent = node.parentElement;
    if (!parent) {
      return true;
    }
    return !!parent.closest('script, style, noscript, mark, .search-wrap, form, input, textarea, select, button, option');
  }

  function highlightMatches(query) {
    clearHighlights();

    const value = query.trim();
    if (!value) {
      status.textContent = 'اكتب كلمة وسيتم تمييزها داخل الصفحة.';
      return;
    }

    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.nodeValue || !node.nodeValue.trim() || shouldSkipNode(node)) {
        continue;
      }
      textNodes.push(node);
    }

    const searchValue = value.toLocaleLowerCase();
    let totalMatches = 0;
    let firstMatch = null;

    textNodes.forEach(function(node) {
      const originalText = node.nodeValue;
      const lowerText = originalText.toLocaleLowerCase();
      let startIndex = 0;
      let matchIndex = lowerText.indexOf(searchValue, startIndex);

      if (matchIndex === -1) {
        return;
      }

      const fragment = document.createDocumentFragment();

      while (matchIndex !== -1) {
        const before = originalText.slice(startIndex, matchIndex);
        if (before) {
          fragment.appendChild(document.createTextNode(before));
        }

        const matchedText = originalText.slice(matchIndex, matchIndex + value.length);
        const mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.textContent = matchedText;
        fragment.appendChild(mark);

        if (!firstMatch) {
          firstMatch = mark;
        }

        totalMatches += 1;
        startIndex = matchIndex + value.length;
        matchIndex = lowerText.indexOf(searchValue, startIndex);
      }

      const after = originalText.slice(startIndex);
      if (after) {
        fragment.appendChild(document.createTextNode(after));
      }

      node.parentNode.replaceChild(fragment, node);
    });

    if (totalMatches > 0) {
      status.textContent = 'تم العثور على ' + totalMatches + ' نتيجة.';
      if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      status.textContent = 'لا توجد نتائج مطابقة.';
    }
  }

  searchBtn.addEventListener('click', function() {
    highlightMatches(input.value);
  });

  clearBtn.addEventListener('click', function() {
    input.value = '';
    clearHighlights();
    status.textContent = 'اكتب كلمة وسيتم تمييزها داخل الصفحة.';
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      highlightMatches(input.value);
    }
  });

  input.addEventListener('input', function() {
    if (!input.value.trim()) {
      clearHighlights();
      status.textContent = 'اكتب كلمة وسيتم تمييزها داخل الصفحة.';
    }
  });
}

createSearchBar();
