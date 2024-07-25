import {
  getAuth as te,
  GoogleAuthProvider as se,
  GithubAuthProvider as ne,
  onAuthStateChanged as W,
  createUserWithEmailAndPassword as ae,
  updateProfile as ie,
  signInWithEmailAndPassword as oe,
  signInWithPopup as G,
  signOut as re,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'
import { initializeApp as ce } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js'
import {
  getFirestore as le,
  collection as q,
  onSnapshot as de,
  query as B,
  where as H,
  doc as S,
  getDoc as O,
  getDocs as z,
  addDoc as me,
  serverTimestamp as ue,
  runTransaction as I,
  deleteDoc as pe,
  Timestamp as ge,
  arrayUnion as he,
  arrayRemove as ve,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js'
;(function () {
  const f = document.createElement('link').relList
  if (f && f.supports && f.supports('modulepreload')) return
  for (const u of document.querySelectorAll('link[rel="modulepreload"]')) _(u)
  new MutationObserver((u) => {
    for (const h of u)
      if (h.type === 'childList')
        for (const o of h.addedNodes)
          o.tagName === 'LINK' && o.rel === 'modulepreload' && _(o)
  }).observe(document, { childList: !0, subtree: !0 })
  function g(u) {
    const h = {}
    return (
      u.integrity && (h.integrity = u.integrity),
      u.referrerPolicy && (h.referrerPolicy = u.referrerPolicy),
      u.crossOrigin === 'use-credentials'
        ? (h.credentials = 'include')
        : u.crossOrigin === 'anonymous'
          ? (h.credentials = 'omit')
          : (h.credentials = 'same-origin'),
      h
    )
  }
  function _(u) {
    if (u.ep) return
    u.ep = !0
    const h = g(u)
    fetch(u.href, h)
  }
})()
const fe = 'AIzaSyCwbb7PceRaS4TpHA422uRqU3f7aHKLB38',
  _e = 'a84e34ea',
  Y = `https://www.omdbapi.com/?apikey=${_e}&`,
  ye = async () => ({
    searchMovies: async (g) => {
      const _ = `${Y}s=${g}&type=movie`
      return await (await fetch(_, { method: 'GET' })).json()
    },
    getMovieByIMDBId: async (g) => {
      const _ = `${Y}i=${g}&type=movie`
      return await (await fetch(_, { method: 'GET' })).json()
    },
  }),
  U = await ye(),
  X = (c) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c),
  K = (c) =>
    /^[A-Za-zÀ-ÖØ-öø-ÿ]([A-Za-zÀ-ÖØ-öø-ÿ '’-]*[A-Za-zÀ-ÖØ-öø-ÿ])?$/.test(c)
function be(c) {
  const f = c.length
  if (f === 0) return 0
  const g = c.reduce((u, h) => u + (h === !0 ? 1 : 0), 0)
  return Math.round((g / f) * 100)
}
function we(c) {
  if (c) {
    const f = /^(van(?: de| der)?\s)?(.+)$/i,
      [g, _] = c.split(' '),
      u = _ ? _.match(f) : g.match(f)
    if (u) {
      const h = u[1] || '',
        o = u[2]
      return { givenName: _ ? g : '', familyName: h + o }
    } else return { givenName: g || '', familyName: '' }
  } else
    return (
      console.error('No name was specified'), { givenName: '', familyName: '' }
    )
}
const C = (c) => {
    const f = c.querySelectorAll('.movie__title')
    let g = c.querySelectorAll('.movie__plot')
    const _ = c.querySelectorAll('.movie__genre')
    if (g.length > 0) {
      const u = [...g]
      do
        shave(f, 50),
          shave(g, 80),
          shave(_, 20),
          (g = c.querySelectorAll('.movie__plot'))
      while (u.some((h) => h.offsetHeight > 80))
    }
  },
  Le = (c) => new Promise((f) => setTimeout(f, c)),
  xe = {
    apiKey: fe,
    authDomain: 'reel-talk-28ac2.firebaseapp.com',
    projectId: 'reel-talk-28ac2',
    storageBucket: 'reel-talk-28ac2.appspot.com',
    messagingSenderId: '443433011935',
    appId: '1:443433011935:web:eea850249032f956a2376a',
    measurementId: 'G-ZQE3HNSMHS',
  },
  Ee = async () => {
    const c = async () => await ce(xe),
      f = async (m) => {
        const n = await O(S(l, 'accounts', m))
        if (n.exists()) return n.data()
      },
      g = async (m) => {
        const n = [],
          d = q(l, 'movies'),
          y = B(d, H('imdbID', 'in', m)),
          b = await z(y)
        return b.empty
          ? !1
          : (b.forEach((w) => {
              n.push(w.data())
            }),
            n)
      },
      _ = async (m) => {
        const n = q(l, 'lists'),
          d = B(n, H('uid', '==', m)),
          y = await z(d)
        if (y.empty) return !1
        {
          const b = []
          return (
            y.forEach((w) => {
              b.push({ docPath: w.ref.path, data: w.data() })
            }),
            b
          )
        }
      },
      u = async (m) => {
        const n = await O(S(l, m))
        if (n.exists()) return n.data()
      },
      h = async (m) => {
        try {
          const n = q(l, 'lists'),
            d = await me(n, {
              uid: m.uid,
              title: m.title,
              createdAt: ue(),
              movies: [],
            })
        } catch (n) {
          console.error(`Something went wrong, the error was: ${n}`)
        }
      },
      o = async (m, n) => {
        try {
          await I(l, async (d) => {
            const y = S(l, m),
              b = (await d.get(y)).data().movies,
              w = b.find((L) => L.imdbID === n)
            ;(w.watched = !w.watched), await d.update(y, { movies: b })
          })
        } catch (d) {
          console.error(d)
        }
      },
      e = async (m) => {
        const n = await O(S(l, m))
        if (n.exists()) return n.data().movies
      },
      a = async (m) => {
        await pe(S(l, m))
      },
      p = async (m) => {
        try {
          await I(l, async (n) => {
            const d = S(l, 'movies', m)
            if ((await n.get(d)).exists())
              throw `There is already a local entry for ${m}`
            {
              const b = await U.getMovieByIMDBId(m)
              await n.set(d, b)
            }
          }),
            console.log(
              `Success! Movie ${m} was added to the local movies collection.`
            )
        } catch (n) {
          console.error(`Adding movie to local DB failed because: ${n}`)
        }
      },
      i = async (m, n, d, y) => {
        try {
          await I(l, async (b) => {
            const w = S(l, m),
              L = await b.get(w)
            if (!L.exists()) throw 'The specified list does not exist'
            const k = L.data().movies.find((M) => M.imdbID === n)
            try {
              if (k) d && d.show(`'${y}' is already on that watchlist!`)
              else {
                const M = ge.now(),
                  N = {
                    imdbID: n,
                    watched: !1,
                    addedAt: M,
                    comments: null,
                  }
                await p(n)
                const R = S(l, 'movies', n)
                if ((await b.get(R)).exists())
                  await b.update(w, { movies: he(N) }),
                    console.log(`Successfully added movie ${n} to list ${m}`)
                else
                  throw 'Local movie data not found...was it added to local movies collection?'
              }
            } catch (M) {
              console.error(
                `Failed to add movie ${n} to list ${m} because: ${M}`
              )
            }
          })
        } catch (b) {
          console.error(`Failed to add movie ${n} to list ${m} because: ${b}`)
        }
      },
      t = async (m, n) => {
        try {
          await I(l, async (d) => {
            const y = S(l, m),
              b = await d.get(y)
            if (!b.exists()) throw "The specified list doesn't exist"
            const L = b.data().movies.find((E) => E.imdbID === n)
            try {
              if (L)
                await d.update(y, { movies: ve(L) }),
                  console.log(
                    `Success! The movie ${n} was removed from list ${m}`
                  )
              else throw "The specified movie wasn't found on this list"
            } catch (E) {
              console.error(
                `Couldn't remove the movie ${n} from list ${m} because: ${E}`
              )
            }
          })
        } catch (d) {
          console.error(`Failed to remove because: ${d}`)
        }
      },
      v = async (m) => {
        try {
          await I(l, async (n) => {
            const d = S(l, 'accounts', m.uid),
              y = await n.get(d),
              { givenName: b, familyName: w } = we(m.displayName)
            let { photoURL: L } = m
            if ((L || (L = '/assets/blank.png'), !y.exists())) {
              const E = {
                displayName: m.displayName,
                givenName: b,
                familyName: w,
                photoURL: L,
                favoriteGenres: [],
              }
              await n.set(d, E)
            }
          })
        } catch (n) {
          console.log(
            `Something went wrong during user creation. The error was ${n}`
          )
        }
      },
      r = () => s,
      s = await c(),
      l = await le(s)
    return {
      get: r,
      getAccount: f,
      getListsForUser: _,
      getListByPath: u,
      getMovies: g,
      getMoviesFromList: e,
      createAccount: v,
      createList: h,
      removeListAtPath: a,
      addMovieToDB: p,
      addMovieToList: i,
      removeMovieFromList: t,
      toggleMovieWatched: o,
      collection: q,
      onSnapshot: de,
      query: B,
      where: H,
      db: l,
      doc: S,
    }
  },
  x = await Ee(),
  A = (c, f) => {
    const g = document.createElement('p')
    g.classList.add('form__warning-msg'),
      (g.innerHTML = `
        <i class='bx bx-x-circle'></i>
        <span>${f}</span<
    `),
      c.after(g),
      setTimeout(() => {
        g.remove()
      }, 1e4)
  },
  V = (c, f) => {
    const { resetState: g, valid: _, msg: u } = f
    if (g) {
      c.classList.contains('warning') && c.classList.remove('warning'),
        c.classList.contains('valid') && c.classList.remove('valid')
      const h = c
        .closest('.form__input-container')
        .querySelector('.form__warning-msg')
      h && h.remove()
    } else {
      const o = c
          .closest('.form__input-container')
          .querySelector('.form__warning-msg'),
        e = _ ? 'valid' : 'warning'
      c.classList.remove('valid', 'warning'), c.classList.add(e)
      const a = document.createElement('p')
      a.classList.add('form__warning-msg'),
        (a.innerHTML = `
            <i class='bx bx-x-circle'></i>
            <span>${u}</span<
        `),
        _ ? o && o.remove() : o ? o.replaceWith(a) : c.after(a)
    }
  },
  Z = (c, f) => {
    const g = [...c.elements]
    g.forEach((_) => {
      _.type !== 'submit' && f(_)
    })
    for (const _ of g) if (_.classList.contains('warning')) return !1
    return !0
  },
  $e = () => {
    const c = async (t) => {
        try {
          if (!t) throw 'newUser object missing'
          const v = await ae(a, t.email, t.password)
          await ie(v.user, {
            displayName: `${t.givenName} ${t.familyName}`,
          }),
            await x.createAccount(v.user)
        } catch (v) {
          if (v.code === 'auth/email-already-in-use') {
            const r = document.querySelector('#email')
            A(r, 'Email address already in use')
          } else if (v.code === 'auth/email-already-in-use') {
            const r = document.querySelector('#signup-form'),
              s = v.code
            A(r, s)
          }
        }
      },
      f = async (t, v) => {
        try {
          const r = await oe(a, t, v)
        } catch (r) {
          const s = document.querySelector('#signin-form')
          if (
            (document
              .querySelector('.main')
              .classList.remove('spinner', 'dimmed'),
            r.code === 'auth/invalid-credential')
          )
            A(s, 'Email address and password not recognized')
          else if (r.code === 'auth/too-many-requests')
            A(s, 'Account locked! Try again later...')
          else {
            const l = r.code
            A(s, l)
          }
        }
      },
      g = async (t) => {
        try {
          const r = (await G(a, p)).user
          ;(await x.getAccount(r.uid)) || x.createAccount(r)
        } catch (v) {
          const r = document.querySelector('#signin-alt-btn-container')
          if (v.code === 'auth/account-exists-with-different-credential')
            t(r, 'Email address already in use with an alternate provider.')
          else {
            const s = v.code
            t(r, s)
          }
        }
      },
      _ = async () => {
        try {
          const v = (await G(a, i)).user
          ;(await x.getAccount(v.uid)) || x.createAccount(v)
        } catch (t) {
          const v = document.querySelector('#signin-alt-btn-container')
          if (t.code === 'auth/account-exists-with-different-credential')
            A(v, 'Email address already in use with an alternate provider.')
          else {
            const r = t.code
            A(v, r)
          }
        }
      },
      u = () => {
        try {
          re(a)
        } catch (t) {
          console.error(`Error signing out. The error was: ${t}`)
        }
      },
      h = () => {
        W(a, (t) => {
          console.log(t ? `User ${t.email} is logged in` : 'User is logged out')
        })
      },
      o = () => a,
      e = () => a.currentUser || null,
      a = te(x.get()),
      p = new se(),
      i = new ne()
    return {
      get: o,
      fbCreateUserAndSignIn: c,
      fbSignIn: f,
      fbSignOut: u,
      signInWithGoogle: g,
      signInWithGithub: _,
      getUser: e,
      watchAuthState: h,
      onAuthStateChanged: W,
    }
  },
  $ = $e(),
  Me = () => {
    const c = (h) => {
        const o = {
            navigate: () => {
              h.preventDefault()
              const { pathname: a } = h.target
              T.navigate(a)
            },
          },
          { type: e } = h.target.dataset
        o[e] && o[e]()
      },
      f = () => `
        <section class="page__container page__container-large">
            <h1 class="home__tagline">Discover. Curate. Watch.</h1>
            <p class="home__cta">
                Your movie watchlists, sorted. Click below to get started, or
                <a href="/signin" data-type="navigate">sign in with Google or Github!</a>
            </p>  
            </p>
            <a class="home__signup-btn" href="/signup" data-type="navigate">
                Get started
                <i class='bx bxs-chevron-right bx-md'></i>
            </a>
        </section>
        `,
      g = () => {
        u.innerHTML = f()
      },
      _ = () => (g(), u),
      u = document.createElement('main')
    return u.addEventListener('click', c), u.classList.add('main'), { get: _ }
  },
  Se = Me(),
  ke = () => {
    const c = (e) => {
        const a = {
            hide: () => {
              u()
            },
          },
          { type: p } = e.target.dataset
        a[p] ? a[p]() : e.target.tagName === 'DIALOG' && u()
      },
      f = (e) => `
            <div id="modal__inner" class="modal__inner">
                <p><i class='bx bxs-error-circle bx-md'></i></p>
                <p class="modal__p">${e}</p>
                <button class="modal__btn" data-type="hide">Close</button>
            </div>
        `,
      g = (e) => {
        o.innerHTML = f(e)
      },
      _ = (e) => {
        g(e), o.showModal()
      },
      u = () => {
        o.close()
      },
      h = () => (g(), o),
      o = document.createElement('dialog')
    return (
      o.classList.add('modal'),
      (o.id = 'modal'),
      o.addEventListener('click', c),
      { get: h, show: _ }
    )
  },
  F = ke(),
  Ae = () => {
    let c = null,
      f = null
    const g = (n) => {
        const d = {
          addmovie: async () => {
            await t(n.target)
          },
          closelist: () => {
            e()
          },
        }
        n.preventDefault()
        const { type: y } = n.target.dataset
        d[y] && d[y]()
      },
      _ = (n, d, y) => {
        const b = u(n, d)
        return `
            <ul class="context-menu__watchlists" data-movietitle="${y}">
                ${b}
            </ul>
            <button class="context-menu__close-btn" data-type="closelist">
                <i class='bx bx-x'></i>
            </button>
        `
      },
      u = (n, d) =>
        n
          ? n
              .map((b) => {
                const { title: w } = b.data,
                  { docPath: L } = b
                return `
                    <li class="context-menu__list" data-type="addmovie" data-list="${L}" data-movieid="${d}">
                        <i class='bx bx-list-plus'></i>
                        <span>${w}</span>
                    </li>
                `
              })
              .join('')
          : '',
      h = (n, d) => {
        ;(c = d),
          c.classList.add('movie__add-btn--active'),
          (f = d.closest('li'))
        const { movieid: y, movietitle: b } = d.dataset
        v(n, y, b),
          l != 1 &&
            ((l = 1),
            s.classList.add(m),
            document.addEventListener('click', o, { capture: !0 }),
            document.addEventListener('keyup', a))
      },
      o = (n) => {
        document.querySelector('#context-menu').contains(n.target) || e()
      },
      e = () => {
        c.classList.remove('movie__add-btn--active'),
          l != 0 &&
            ((l = 0),
            s.classList.remove(m),
            document.removeEventListener('click', o, !0))
      },
      a = (n) => {
        n.which === 27 && e()
      },
      p = (n) => {
        var d = 0,
          y = 0
        return (
          n.pageX || n.pageY
            ? ((d = n.pageX), (y = n.pageY))
            : (n.clientX || n.clientY) &&
              ((d =
                n.clientX +
                document.body.scrollLeft +
                document.documentElement.scrollLeft),
              (y =
                n.clientY +
                document.body.scrollTop +
                document.documentElement.scrollTop)),
          { x: d, y }
        )
      },
      i = (n) => {
        let d = p(n),
          y = d.x,
          b = d.y,
          w = s.offsetWidth + 4,
          L = s.offsetHeight + 4,
          E = window.innerWidth,
          k = window.innerHeight
        E - y < w ? (s.style.left = E - w + 'px') : (s.style.left = y + 'px'),
          k - b < L ? (s.style.top = k - L + 'px') : (s.style.top = b + 'px')
      },
      t = async (n) => {
        const { list: d, movieid: y } = n.dataset,
          { movietitle: b } = n.closest('ul').dataset
        e(),
          d &&
            (f.classList.add('spinner', 'movie__card--dimmed'),
            await x.addMovieToList(d, y, F, b),
            f.classList.remove('spinner', 'movie__card--dimmed'))
      },
      v = (n, d, y) => {
        s.innerHTML = _(n, d, y)
      },
      r = () => (v(), s),
      s = document.createElement('div')
    ;(s.id = 'context-menu'),
      s.classList.add('context-menu'),
      s.addEventListener('click', g)
    let l = 0,
      m = 'block'
    return { get: r, handleOpenMenu: h, positionMenu: i }
  },
  P = Ae(),
  Q = '/assets/poster-placeholder-DzQ6_1Tp.png',
  J =
    "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='240'%20height='240'%3e%3cpath%20fill='%23F8D64E'%20d='m48,234%2073-226%2073,226-192-140h238z'/%3e%3c/svg%3e",
  Ie = () => {
    const c = (s) => {
        const l = {
          submit: () => {
            f()
          },
          add: async () => {
            i.length > 0
              ? s.target.dataset.movieid &&
                (P.handleOpenMenu(i, s.target), P.positionMenu(s))
              : F.show(
                  "You don't have any lists yet! To get started, go to My Lists and create a list or two."
                )
          },
        }
        s.preventDefault()
        const { type: m } = s.target.dataset
        l[m] && l[m]()
      },
      f = () => {
        const s = document.getElementById('find-movies-input')
        if (s.value) {
          t.querySelector('#page-results').classList.add(
            'spinner',
            'page__results--dimmed'
          )
          const { value: m } = document.querySelector('#find-movies-input')
          u(m)
        } else s.classList.add('warning')
      },
      g = async () => `
            <header class="page__header">
                <div class="header__search">
                    <input class="search__input" type="text" id="find-movies-input" placeholder="e.g. 'The Matrix' or 'Blade Runner'"/>
                    <button class="search__btn" id="find-movies-btn" data-type="submit">
                        <i class='bx bx-search'></i>
                    </button>
                </div>
            </header>
            <section id="page-results" class="page__results">
                <ul class="movie__list">
                    ${await _(p)}
                </ul>
            </section>
        `,
      _ = async (s) => {
        let l = ''
        return (
          s
            ? (l = await Promise.all(
                s.map(async (m) => {
                  const n = await U.getMovieByIMDBId(m.imdbID),
                    {
                      Title: d,
                      Year: y,
                      Genre: b,
                      Plot: w,
                      Poster: L,
                      imdbID: E,
                    } = n,
                    k = L === 'N/A' ? Q : L
                  let M = ''
                  return (
                    n.Ratings[0] && (M = n.Ratings[0].Value),
                    `
                        <li class="movie__card">
                            <img class="movie__thumbnail" src="${k}" alt="Poster for the movie ${d}">
                            <div class="movie__info">
                                <div class="movie__header">
                                    <h3 class="movie__title">${d}</h3>
                                    <p><img class="movie__star" src="${J}"><span>${M}</span></p>
                                </div>
                                <div class="movie__details">
                                    <span>${y}</span>• 
                                    <span class="movie__genre">${b}</span>
                                </div>
                                <p class="movie__plot">${w}</p>
                                <div class="movie__btns">
                                    <button class="movie__btn movie__add-btn" data-type="add" data-movieid="${E}" data-movietitle="${d}"><i class='bx bx-add-to-queue bx-sm'></i> <span>Add to list</span></button>
                                </div>
                            </div>
                        </li>
                    `
                  )
                })
              ))
            : (l = [
                `
                <li class="page__empty">
                    <p><i class='bx bx-movie-play bx-lg'></i></p>
                    <p>
                        Enter a movie title and hit search to get started!
                    </p>
                </li>
            `,
              ]),
          [...l].join('')
        )
      },
      u = async (s) => {
        try {
          if (!s) throw 'No search term supplied'
          ;(p = (await U.searchMovies(s)).Search), await o()
        } catch (l) {
          console.error(`Unable to get results because: ${l}`)
        }
      },
      h = (s) => {
        s.target.classList.contains('warning') &&
          s.target.classList.remove('warning')
      },
      o = async () => {
        ;(t.innerHTML = await g()),
          t.appendChild(P.get()),
          t.appendChild(F.get())
      },
      e = async (s) => (
        (a = s.uid), (i = await x.getListsForUser(a)), (p = null), await o(), t
      )
    let a = null,
      p = null,
      i = null
    const t = document.createElement('main')
    return (
      t.classList.add('main'),
      t.addEventListener('click', c),
      t.addEventListener('input', h),
      t.addEventListener('keyup', (s) => {
        s.code === 'Enter' && f()
      }),
      new ResizeObserver((s) => C(t)).observe(t),
      new MutationObserver((s, l) => {
        console.log('mutated'), C(t)
      }).observe(t, { attributes: !1, childList: !0, subtree: !1 }),
      { get: e }
    )
  },
  Te = Ie(),
  qe = () => {
    const c = () => {
        e.addEventListener('click', (a) => {
          f(a)
        })
      },
      f = (a) => {
        const p = {
            hide: () => {
              h()
            },
            yes: () => {
              h('yes')
            },
            no: () => {
              h('no')
            },
          },
          { type: i } = a.target.dataset
        p[i] ? p[i]() : a.target.tagName === 'DIALOG' && h()
      },
      g = (a) => `
            <div id="modal__inner" class="modal__inner">
                <p><i class='bx bxs-error-circle bx-md'></i></p>
                <p class="modal__p">${a}</p>
                <div class="modal__btn-container">
                    <button class="modal__btn" data-type="yes">Yes</button>
                    <button class="modal__btn" data-type="no">No</button>
                </div>
            </div>
        `,
      _ = (a) => {
        e.innerHTML = g(a)
      },
      u = async (a) => (
        _(a),
        e.showModal(),
        document.addEventListener('click', f),
        new Promise((p, i) => {
          e.addEventListener(
            'close',
            () => {
              p(e.returnValue)
            },
            { once: !0 }
          )
        })
      ),
      h = (a) => {
        e.close(a)
      },
      o = () => (_(), e),
      e = document.createElement('dialog')
    return (
      e.classList.add('modal'),
      (e.id = 'modal-confirm'),
      c(),
      { get: o, show: u }
    )
  },
  D = qe(),
  Ce = async () => {
    const c = () => {
        p.addEventListener('click', (t) => {
          f(t)
        }),
          p.addEventListener('input', (t) => {
            t.target.classList.contains('warning') &&
              t.target.classList.remove('warning')
          }),
          p.addEventListener('keyup', (t) => {
            t.code === 'Enter' && g()
          })
      },
      f = (t) => {
        const v = {
          navigate: () => {
            const s = t.target.dataset.path.split('/')[1]
            T.navigate(`/list/${s}`)
          },
          remove: async () => {
            const { path: s, title: l } = t.target.closest('li').dataset
            ;(await D.show(
              `Are you sure you want to delete your '${l}' watchlist?`
            )) === 'yes' && (await x.removeListAtPath(s))
          },
          new: async () => {
            await g()
          },
        }
        t.preventDefault()
        const { type: r } = t.target.dataset
        v[r] && v[r]()
      },
      g = async () => {
        const t = document.getElementById('input-watchlist-title')
        if (t.value) {
          const r = {
            uid: $.getUser().uid,
            title: document.getElementById('input-watchlist-title').value,
          }
          await x.createList(r)
        } else t.classList.add('warning')
      },
      _ = async (t) => `
            <header class="page__header">
                <div class="header__new-watchlist-input">
                    <label for="input-watchlist-title">New Watchlist Title</label>
                    <input class="new-watchlist__input" id="input-watchlist-title" type="text" placeholder="New watchlist name">
                    <button class="new-watchlist__btn" id="btn-new-watchlist" data-type="new"><i class='bx bx-plus bx-sm'></i></button>
                </div>
            </header>
            
            <section id="page-section" class="page__section watchlists__container">
                <ul class="watchlists__list">
                    ${u(t)}
                </ul>
            </section>
        `,
      u = (t) => {
        let v = ''
        return (
          t.length > 0
            ? (v = t
                .map((r) => {
                  const { data: s, docPath: l } = r,
                    m = s.movies.length,
                    n = s.movies.reduce((y, b) => (y.push(b.watched), y), []),
                    d = be(n)
                  return `
                    <li class="watchlist__item" data-type="navigate" data-path="${l}" data-title="${s.title}">
                        <h3 class="item__title">${s.title}</h3>
                        <div class="item__details">
                        <p>🎬 Movies: ${m}</p>
                        <p>🍿 Watched: ${d}%</p>
                        </div>
                        <div class="item__progbar">
                            <div class="item__progbar-prog" style="width: ${d}%"></div>
                        </div>
                        <button class="item__btn-remove" id="remove-list-btn" data-type="remove">
                            <i class='bx bx-trash'></i>
                        </button>
                    </li>
                `
                })
                .join(''))
            : (v = `
                <li class="page__empty">
                    <p><i class='bx bx-list-ul bx-lg'></i></p>
                    <p>
                        Looks like you haven't added any lists yet! Enter a list name and click + to add your first list.
                    </p>
                </li>
            `),
          v
        )
      },
      h = async (t) => {
        const v = x.query(x.collection(x.db, 'lists'), x.where('uid', '==', t))
        i = x.onSnapshot(v, (r) => {
          const s = []
          r.empty ||
            r.forEach((l) => {
              s.push({ docPath: l.ref.path, data: l.data() })
            }),
            e(s)
        })
      },
      o = () => {
        const t = D.get()
        p.append(t)
      },
      e = async (t) => {
        ;(p.innerHTML = await _(t)), o()
      },
      a = async () => (o(), p),
      p = document.createElement('main')
    p.classList.add('main')
    let i = null
    return (
      await $.onAuthStateChanged($.get(), (t) => {
        t ? ((p.innerHTML = ''), h(t.uid)) : !i === null && i()
      }),
      c(),
      { get: a }
    )
  },
  De = await Ce(),
  Ne = async () => {
    const c = (i) => {
        const t = {
            back: () => {
              i.preventDefault(), history.go(-1)
            },
            removemovie: async () => {
              const { listPath: r } = i.target.closest('ul').dataset,
                { movieId: s, movieTitle: l } = i.target.dataset
              r &&
                s &&
                (await D.show(`Really remove '${l}'?`)) === 'yes' &&
                (await x.removeMovieFromList(r, s))
            },
            togglewatched: async () => {
              const { listPath: r } = i.target.closest('ul').dataset,
                { movieId: s } = i.target.dataset
              console.log(r, s), await x.toggleMovieWatched(r, s)
            },
          },
          { type: v } = i.target.dataset
        t[v] && t[v]()
      },
      f = async (i, t, v) => {
        const r = await g(v, i)
        return `
            <header class="page__header">
                <div class="header__list">
                    <a class="header__btn-back" href="#" data-type="back"><i class='bx bx-arrow-back bx-sm'></i></a>
                    <h2 class="header__list-title">${t}</h2>
                </div>
            </header>
            <section id="page-section" class="page__results">
                <ul class="movie__list" data-list-path="${i}">
                    ${r}
                </ul>
            </section>
        `
      },
      g = async (i, t) => {
        const v = await x.getMoviesFromList(t)
        let r = ''
        return (
          i.length > 0
            ? (r = (await x.getMovies(i))
                .map((l) => {
                  const {
                      Title: m,
                      Runtime: n,
                      Genre: d,
                      Plot: y,
                      Poster: b,
                      imdbID: w,
                    } = l,
                    L = v.find((ee) => ee.imdbID === l.imdbID),
                    E = b === 'N/A' ? Q : b
                  let k = 'N/A'
                  l.Ratings[0] && (k = l.Ratings[0].Value)
                  const M = L.watched,
                    N = `
                    <button class="movie__btn movie__btn-watched ${M ? 'movie__btn--active' : ''}" data-type="togglewatched" data-movie-id="${w}">
                            ${M ? "<i class='bx bxs-checkbox-checked'></i>" : "<i class='bx bx-checkbox'></i>"}
                            <span>Watched</span>
                    </button>
                `,
                    R = `
                    <button class="movie__btn movie__remove-btn" data-type="removemovie" data-movie-id="${w}" data-movie-title="${m}">
                        <i class='bx bx-x' ></i>
                        <span>Remove</span>
                    </button>
                `,
                    j = `
                    <a class="movie__btn movie__btn-a movie__btn-imdb" href="https://www.imdb.com/title/${l.imdbID}/" target="_blank">
                        <i class='bx bx-link-external'></i>
                        <span>IMDb</span>
                    </a>
                `
                  return `    
                        <li class="movie__card">
                            <img class="movie__thumbnail" src="${E}" alt="Poster for the movie ${m}">
                            <div class="movie__info">
                                <div class="movie__header">
                                    <h3 class="movie__title">${m}</h3>
                                    <p><img class="movie__star" src="${J}"><span>${k}</span></p>
                                </div>
                                <div class="movie__details">
                                    <p>${n}</p>       
                                    <p>${d}</p>
                                </div>
                                <p class="movie__plot">${y}</p>
                                <div class="movie__btns">
                                    ${N}
                                    ${R}
                                    ${j}
                                </div>
                            </div>
                        </li>
                `
                })
                .join(''))
            : (r += `
                <li class="page__empty">
                    <p><i class='bx bx-confused bx-lg'></i></p>
                    <p>
                       This list needs movies! Head over to 'Find Movies' to add some.
                    </p>
                </li>`),
          r
        )
      },
      _ = async (i) => {
        const t = x.doc(x.db, i)
        o = x.onSnapshot(t, async (v) => {
          if (!v.empty) {
            const { title: r, movies: s } = v.data(),
              l = Object.values(s).map((m) => m.imdbID)
            await u(i, r, l)
          }
        })
      },
      u = async (i, t, v) => {
        const r = await f(i, t, v)
        ;(e.innerHTML = r), e.querySelector('#page-section').after(D.get())
      },
      h = async (i, t) => (
        (e.innerHTML = ''),
        t && (o === null ? await _(t) : (o(), await _(t))),
        e
      )
    let o = null
    const e = document.createElement('main')
    return (
      e.classList.add('main'),
      e.addEventListener('click', c),
      new ResizeObserver((i) => C(e)).observe(e),
      new MutationObserver((i, t) => {
        for (const v of i) v.type === 'childList' && C(e)
      }).observe(e, { attributes: !1, childList: !0, subtree: !1 }),
      { get: h }
    )
  },
  Re = await Ne(),
  Be = () => {
    const c = () => {
        o.addEventListener('click', (e) => {
          f(e)
        }),
          o.addEventListener('input', (e) => {
            _(e.target)
          })
      },
      f = (e) => {
        const a = {
            signin: async () => {
              e.preventDefault()
              const i = e.target.closest('form')
              if (Z(i, _)) {
                o.classList.add('spinner', 'dimmed')
                const t = document.getElementById('login-email').value,
                  v = document.getElementById('login-password').value
                await $.fbSignIn(t, v)
              }
            },
            signinwithgoogle: () => {
              $.signInWithGoogle()
            },
            signinwithgithub: () => {
              $.signInWithGithub()
            },
          },
          { type: p } = e.target.dataset
        a[p] && a[p]()
      },
      g = () => `
            <section class="page__container page__container-small">
                <h1>Sign in</h1>
                <form id="signin-form">
                    <div class="form__input-container">
                        <label class="form__label" for="login-email">Email</label>
                        <input class="form__input" type="text" name="login-email" id="login-email" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="login-password">Password</label>
                        <input class="form__input" type="password" name="login-password" id="login-password" />
                    </div>
                    <button class="form__btn" type="submit" data-type="signin">Sign in</button>
                </form>
                <div class="page__divider-container">
                    <span class="page__divider"></span>
                    <span>or</span>
                    <span class="page__divider"></span>
                </div>
                <div id="signin-alt-btn-container" class="page__btn-container">
                    <button class="signin__alt-provider-btn" data-type="signinwithgoogle">
                        <i class='bx bxl-google bx-sm'></i>
                        Continue with Google
                    </button>
                    <button class="signin__alt-provider-btn" data-type="signinwithgithub">
                        <i class='bx bxl-github bx-sm' ></i>
                        Continue with Github
                    </button>
               </div>
            </section>
        `,
      _ = (e) => {
        const a = {
            'login-email': () => {
              ;(r = !!(m && X(m))),
                r || (s = m ? 'Email address not valid' : 'Email is required')
            },
            'login-password': () => {
              ;(r = !!n), r || (s = 'Password field should not be empty')
            },
          },
          { id: p } = e,
          i = e.closest('form'),
          t = Object.fromEntries(
            Object.values(i).map((y) => [y.name, y.value])
          ),
          v = o.querySelector(`#${p}`)
        let r = null,
          s = null,
          l = !1
        const { 'login-email': m, 'login-password': n } = t
        a[p] && a[p](), V(v, { resetState: l, valid: r, msg: s })
      },
      u = () => {
        o.classList.contains('spinner') &&
          o.classList.remove('spinner', 'dimmed'),
          (o.innerHTML = g())
      },
      h = () => (u(), o),
      o = document.createElement('main')
    return c(), o.classList.add('main'), { get: h }
  },
  He = Be(),
  Oe = () => {
    const c = () => {
        o.addEventListener('click', (e) => {
          f(e)
        }),
          o.addEventListener('input', (e) => {
            g(e.target)
          })
      },
      f = (e) => {
        const a = {
          signup: async () => {
            const i = e.target.closest('form')
            if (Z(i, g)) {
              o.classList.add('spinner', 'dimmed')
              const t = Object.fromEntries(
                  Object.values(i).map((n) => [n.name, n.value])
                ),
                {
                  'given-name': v,
                  'family-name': r,
                  email: s,
                  password: l,
                } = t,
                m = {
                  givenName: v,
                  familyName: r,
                  email: s,
                  password: l,
                }
              await $.fbCreateUserAndSignIn(m)
            }
          },
          navigate: () => {
            const { pathname: i } = e.target
            T.navigate(i)
          },
        }
        e.preventDefault()
        const { type: p } = e.target.dataset
        a[p] && a[p]()
      },
      g = (e) => {
        const a = {
            'given-name': () => {
              ;(r = !!(m && K(m))),
                r ||
                  (m
                    ? (s = 'Must start, end with and only contain letters')
                    : (s = 'First name is required'))
            },
            'family-name': () => {
              n
                ? ((r = !!K(n)),
                  r || (s = 'Must start, end with and only contain letters'))
                : (l = !0)
            },
            email: () => {
              ;(r = !!(d && X(d))),
                r || (s = d ? 'Email address not valid' : 'Email is required')
            },
            password: () => {
              ;(r = y.length >= 6),
                r || (s = 'Password must be at least 6 characters'),
                g(o.querySelector('#password-confirm'))
            },
            'password-confirm': () => {
              ;(r = b === y), r ? b || (l = !0) : (s = 'Passwords do not match')
            },
          },
          { id: p } = e,
          i = e.closest('form'),
          t = Object.fromEntries(
            Object.values(i).map((L) => [L.name, L.value])
          ),
          v = o.querySelector(`#${p}`)
        let r = null,
          s = null,
          l = !1
        const {
          'given-name': m,
          'family-name': n,
          email: d,
          password: y,
          'password-confirm': b,
        } = t
        a[p] && a[p](), V(v, { resetState: l, valid: r, msg: s })
      },
      _ = () => `
            <section class="page__container page__container-small">
                <h1>We just need a few details to create your membership</h1>
                <p class="signup__p">Don't worry, this won't take long (and it's free!). We'll have you 
                signed up in no time 🙃
                <form id="signup-form">
                    <div class="form__input-container">
                        <label class="form__label" for="given-name">First name</label>
                        <input class="form__input" type="text" name="given-name" id="given-name" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="family-name">Last name</label>
                        <input class="form__input" type="text" name="family-name" id="family-name" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="email">Email</label>
                        <input class="form__input" type="text" name="email" id="email" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="password">Password</label>
                        <input class="form__input" type="password" name="password" id="password" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="password-confirm">Confirm password</label>
                        <input class="form__input" type="password" name="password-confirm" id="password-confirm" />
                    </div>
                    <button class="form__btn" data-type="signup">Sign Up</button>
                </form>
            </section>
        `,
      u = () => {
        o.classList.contains('spinner') &&
          o.classList.remove('spinner', 'dimmed'),
          (o.innerHTML = _())
      },
      h = () => (u(), o),
      o = document.createElement('main')
    return o.classList.add('main'), u(), c(), { get: h }
  },
  Pe = Oe(),
  Ue = '/assets/logo-dark-Bslq0CVD.png',
  Fe = '/assets/blank-CGtgiMPE.png',
  je = () => {
    const c = (e) => {
        const a = {
          hamburger: () => {
            g()
          },
          navigate: () => {
            const i = o ? '/mylists' : '/',
              t = e.target.pathname || i
            T.navigate(t),
              document
                .querySelector('#hamburger')
                .classList.contains('is-active') && g()
          },
          signout: () => {
            $.fbSignOut()
          },
        }
        e.preventDefault()
        const { type: p } = e.target.dataset
        a[p] && a[p]()
      },
      f = async (e) => {
        let a = ''
        if (o) {
          let i = null
          do (i = await x.getAccount(o.uid)), await Le(500)
          while (!i)
          a = `
                <ul class="header__menu" id="menu">
                    <li class="nav__item">
                        <a href="/findmovies" class="nav__link" data-type="navigate">Find Movies</a>
                    </li>
                    <li class="nav__item">
                        <a href="/mylists" class="nav__link" data-type="navigate">My Lists</a>
                    </li>
                    <li class="nav__item">
                        <a href="#" class="nav__link" data-type="signout">Sign out</a>
                    </li>
                    <li class="nav__item header__avatar-li">
                        <img src="${i.photoURL !== '/assets/blank.png' ? i.photoURL : Fe}" class="header__avatar" alt="User avatar image">
                    </li>
                </ul>
            `
        } else
          a = `
                <ul class="header__menu" id="menu">
                    <li class="nav__item">
                        <a href="/signup" class="nav__link" data-type="navigate">Sign up</a>
                    </li>
                    <li class="nav__item">
                        <a href="/signin" class="nav__link nav__sign-in" data-type="navigate">Sign in</a>
                    </li>
                </ul>
            `
        return `
                <div class="header__logo-div" data-type="navigate">
                    <img class="header__logo-img" src="${Ue}" alt="Reel Talk logo">
                    <h1 class="header__logo" data-type="refresh">Reel Time</h1>
                </div>
                
                   ${a}
                
                <button class="hamburger hamburger--squeeze" id="hamburger" type="button" data-type="hamburger">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                </button>
        `
      },
      g = () => {
        console.log('toggling'),
          document.querySelector('#hamburger').classList.toggle('is-active'),
          document.querySelector('.main').classList.toggle('has-no-events'),
          h.querySelector('.header__menu').classList.toggle('open')
      },
      _ = async (e) => {
        h.innerHTML = await f()
        const a = h.querySelector(`[href="${e}"]`)
        a && a.classList.add('nav__item--active')
      },
      u = async (e, a) => ((o = a), await _(e), h),
      h = document.createElement('header')
    h.classList.add('header')
    let o = null
    return (
      h.addEventListener('click', c),
      document.addEventListener('click', (e) => {
        const a = document.querySelector('.header__menu')
        !e.target.closest('.header__menu') &&
          a.classList.contains('open') &&
          e.target.id != 'hamburger' &&
          g()
      }),
      { get: u }
    )
  },
  We = je(),
  Ge = () => {
    const c = () => `
            <p>Reel Talk</p>
            <p>Copyright Jimmy ©2024</p>
        `,
      f = () => {
        _.innerHTML = c()
      },
      g = () => (f(), _),
      _ = document.createElement('footer')
    return _.classList.add('footer'), { get: g }
  },
  ze = Ge(),
  Ye = () => {
    let c = {}
    const f = () => {
        c = {
          '/': { module: Se, requiresLogin: !1, content: [] },
          '/findmovies': {
            module: Te,
            requiresLogin: !0,
            content: [],
          },
          '/mylists': { module: De, requiresLogin: !0, content: [] },
          '/list': { module: Re, requiresLogin: !0, content: [] },
          '/signin': { module: He, requiresLogin: !1, content: [] },
          '/signup': { module: Pe, requiresLogin: !1, content: [] },
          '/unknown': {
            content: (() => {
              const e = document.createElement('div')
              return (
                (e.innerHTML = `
                        <h1>Well, this is embarassing.</h1>
                        <p>We couldn't find what you requested. Please click 
                        <a href="/" data-type="navigate">here</a> to return to
                        the homepage.
                        </p>
                    `),
                e
              )
            })(),
          },
        }
      },
      g = () => {
        window.onpopstate = (e) => {
          h(location.pathname, !1)
        }
      },
      _ = async (e, a, p, i) => {
        try {
          return [await We.get(p, a), await e.get(a, i), ze.get()]
        } catch (t) {
          console.error(t)
        }
      },
      u = () => {
        $.onAuthStateChanged($.get(), async (e) => {
          h(location.pathname)
        })
      },
      h = (e, a = !0) => {
        const p = e,
          i = $.getUser(),
          t = `/${e.split('/')[1]}`
        console.log(t)
        const v = !!c[t]
        if ((console.log(v), v)) {
          const { requiresLogin: r } = c[t],
            s = {
              loggedIn: () => {
                p === '/signin' || p === '/signup' || p === '/'
                  ? (a && history.pushState({}, '', '/mylists'), o('/mylists'))
                  : (a && history.pushState({}, '', p), o(p))
              },
              notLoggedIn: () => {
                r
                  ? (a && history.pushState({}, '', '/'), o('/'))
                  : (a && history.pushState({}, '', p), o(p))
              },
            }
          i ? s.loggedIn() : s.notLoggedIn()
        } else a && history.pushState({}, '', p), o(p)
      },
      o = async (e) => {
        e != '/' && (e = e.replace(/\/$/, ''))
        const a = e.split('/')
        let p = ''
        a[1] === 'list' && ((e = '/'.concat(a[1])), (p = 'lists/'.concat(a[2])))
        try {
          c[e].content = await _(c[e].module, $.getUser(), e, p)
          const i = c[e].content
          document.querySelector('#app').replaceChildren(...i)
        } catch (i) {
          console.error(i),
            document
              .querySelector('#app')
              .replaceChildren(c['/unknown'].content)
        }
      }
    return f(), g(), { navigate: h, initialize: u }
  },
  T = Ye()
T.initialize()
/**
  shave - Shave is a javascript plugin that truncates multi-line text within a html element based on set max height
  @version v2.5.7
  @link https://github.com/dollarshaveclub/shave#readme
  @author Jeff Wainwright <yowainwright@gmail.com> (jeffry.in)
  @license MIT
**/
;(function (c, f) {
  typeof exports == 'object' && typeof module < 'u'
    ? (module.exports = f())
    : typeof define == 'function' && define.amd
      ? define(f)
      : ((c = c || self), (c.shave = f()))
})(void 0, function () {
  function c(f, g) {
    var _ = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}
    if (typeof g > 'u' || isNaN(g)) throw Error('maxHeight is required')
    var u = typeof f == 'string' ? document.querySelectorAll(f) : f
    if (u) {
      var h = _.character || '…',
        o = _.classname || 'js-shave',
        e = typeof _.spaces == 'boolean' ? _.spaces : !0,
        a = '<span class="js-shave-char">'.concat(h, '</span>')
      'length' in u || (u = [u])
      for (var p = 0; p < u.length; p += 1) {
        var i = u[p],
          t = i.style,
          v = i.querySelector('.'.concat(o)),
          r = i.textContent === void 0 ? 'innerText' : 'textContent'
        v && (i.removeChild(i.querySelector('.js-shave-char')), (i[r] = i[r]))
        var s = i[r],
          l = e ? s.split(' ') : s
        if (!(l.length < 2)) {
          var m = t.height
          t.height = 'auto'
          var n = t.maxHeight
          if (((t.maxHeight = 'none'), i.offsetHeight <= g)) {
            ;(t.height = m), (t.maxHeight = n)
            continue
          }
          for (var d = l.length - 1, y = 0, b = void 0; y < d; )
            (b = (y + d + 1) >> 1),
              (i[r] = e ? l.slice(0, b).join(' ') : l.slice(0, b)),
              i.insertAdjacentHTML('beforeend', a),
              i.offsetHeight > g ? (d = b - 1) : (y = b)
          ;(i[r] = e ? l.slice(0, d).join(' ') : l.slice(0, d)),
            i.insertAdjacentHTML('beforeend', a)
          var w = e ? ' '.concat(l.slice(d).join(' ')) : l.slice(d),
            L = document.createTextNode(w),
            E = document.createElement('span')
          E.classList.add(o),
            (E.style.display = 'none'),
            E.appendChild(L),
            i.insertAdjacentElement('beforeend', E),
            (t.height = m),
            (t.maxHeight = n)
        }
      }
    }
  }
  return c
})
