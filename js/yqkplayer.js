const log = console.log.bind(console)

const e = (selector) => {
    let element = document.querySelector(selector)
    if (element == null) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return element
    }
}

const es = (selector) => {
    let elements = document.querySelectorAll(selector)
    if (elements.length == 0) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return elements
    }
}

const appendHtml = (element, html) => element.insertAdjacentHTML('beforeend', html)

const bindEvent = (element, eventName, callback) => element.addEventListener(eventName, callback)

const bindAll = (elements, eventName, callback) => {
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

const removeClassAll = (className) => {
    let selector = '.' + className
    var elements = es(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}

const classRemoveAdd = (selector, removeclass, addclass) => {
    let element = e(selector)
    element.classList.remove(removeclass)
    element.classList.add(addclass)
}

const classAddRemove = (selector, addclass, removeclass) => {
    let element = e(selector)
    element.classList.add(addclass)
    element.classList.remove(removeclass)
}

const class1AddClass2Remove = (selector1, addclass, selector2, removeclass) => {
    let element1 = e(selector1)
    let element2 = e(selector2)
    element1.classList.add(addclass)
    element2.classList.remove(removeclass)
}

const variableInnerHtml = (selector, variable) => {
    let element = e(selector)
    let variableBox = `${variable}`
    element.innerHTML = variableBox
}
/*以上为工具函数*/

//播放器正反两面翻转
const Flip_Y_front = () => {
    let element = e('.fa-list')
    let front = e('#yqkplayer')
    bindEvent(element, 'click', function(event) {
        classAddRemove('#yqkplayer', 'flip', 'yqkplayer')
    })
}

const Flip_Y_opposite = () => {
    let element = e('.fa-hand-point-right')
    let front = e('#yqkplayer')
    bindEvent(element, 'click', function(event) {
        classRemoveAdd('#yqkplayer', 'flip', 'yqkplayer')
    })
}

//播放时间分秒样式
const audioTime = (seconds) => {
    var minutes = Math.floor(seconds / 60)
    var seconds = Math.floor(seconds % 60)
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    return minutes + ":" + seconds
}

//播放时间的显示
const functionShowTime = (selector, seconds) => {
    variableInnerHtml(selector, audioTime(seconds))
}

const showCurrentTime = (audio) => {
    timeUpdate = setInterval(function() {
        let input = e('#timeInput')
        let inputmax = Number(input.max)
        let currentTime = audio.currentTime
        let duration = audio.duration
        functionShowTime('.yqkplayer-currenttime', currentTime)
        functionShowTime('.yqkplayer-totaltime', duration)
        input.value = (currentTime / duration) * inputmax
        showInputColor(input)
    }, 500)
}

const bindEventCanplay = (audio) => {
    bindEvent(audio, 'canplay', function() {
        showCurrentTime(audio)
    })
}

//进度条拖拽
const bindEventTimeProgressBar = () => {
    let input = e('#timeInput')
    let audio = e('#audio')
    audio.currentTime = input.value
}

//播放与暂停
const bindEventPlayandPause = (audio) => {
    let play = e('#play')
    bindEvent(play, 'click', function(event) {
        if (play.classList.contains('fa-play')) {
            classRemoveAdd('#play', 'fa-play', 'fa-pause')
            audio.play()
        } else if (!play.classList.contains('fa-play')) {
            classRemoveAdd('#play', 'fa-pause', 'fa-play')
            audio.pause()
        }
    })
}

//快进一首
const showPlayIcon = () => {
    let play = e('#play')
    if (play.classList.contains('fa-play')) {
        classRemoveAdd('#play', 'fa-play', 'fa-pause')
    }
}

const bindEventPlayNextSong = (audio, selector) => {
    let element = e(selector)
    bindEvent(element, 'click', function(event) {
        var self = event.target
        let musiclist = e('#yqkplayerMusiclist')
        let index = nextIndex(musiclist, self)
        playMusicAtIndex(audio, index)
        showPlayIcon()
        audio.play()
    })
}

const bindEventNextSong = (audio) => {
    bindEventPlayNextSong(audio, '#forward')
}

//后退一首
const bindEventBackwardSong = (audio) => {
    bindEventPlayNextSong(audio, '#backward')
}

const bindEventRedHeartIcon = () => {
    var redheart = es('.fa-heart')
    bindAll(redheart, 'click', function(event) {
        var self = event.target
        removeClassAll('seenothing')
        self.classList.add('seenothing')
    })
}

const bindEventChangePlayMode = (audio, data) => {
    let playMode = e('.yqkplayer-playmode')
    bindEvent(playMode, 'click', function(event) {
        var self = event.target
        let random = e('.fa-random')
        let listloop = e('#svglistloop')
        let loop = e('#svgloop')
        if (self == random) {
            class1AddClass2Remove('.fa-random', 'displaynone', '#svglistloop', 'displaynone')
            bindEventEndListloopSong(audio)
        } else if (self == listloop) {
            class1AddClass2Remove('#svglistloop', 'displaynone', '#svgloop', 'displaynone')
            audio.loop = true
        } else if (self == loop) {
            class1AddClass2Remove('#svgloop', 'displaynone', '.fa-random', 'displaynone')
            bindEventEndRandomSong(audio, data)
            audio.loop = false
        }
    })
}

//音量操作
const showInputColor = (input) => {
    let percent = (input.value / input.max) * 100
    input.style.background = `linear-gradient(90deg, #e2e2e2, #db1103 ${percent}%, #db1103 ${percent}%, #e2e2e2 0%)`;
}

const bindEventVolumeProgressBar = () => {
    let input = e('#volumeInput')
    let audio = e('#audio')
    audio.volume = input.value
    showInputColor(input)
}

const changeVolumeInput = (input, audio) => {
    input.value = audio.volume
    showInputColor(input)
}

//音量图标操作
const volumeIconClass = (audio, selector, n, class1, class2) => {
    let input = e(selector)
    audio.volume = n
    classRemoveAdd('#volume', class1, class2)
    changeVolumeInput(input, audio)
}

const bindEventVolumeIcon = (audio) => {
    let element = e('#volume')
    bindEvent(element, 'click', function(event) {
        if (audio.volume != 0) {
            volumeIconClass(audio, '#volumeInput', 0, 'fa-volume-up', 'fa-volume-off')
        } else {
            volumeIconClass(audio, '#volumeInput', 1, 'fa-volume-off', 'fa-volume-up')
        }
    })
}

//歌曲信息库
const dataBase = () => {
    let information = [
        {altSingNamePath: 'Star&nbsp;Sky', altSingerPath: 'Two&nbsp;Steps&nbsp;From&nbsp;Hell', imgPath: 'https://img3.doubanio.com/lpic/s28060765.jpg', musicPath: 'http://music.163.com/song/media/outer/url?id=31654478.mp3', index: '0'},
        {altSingNamePath: 'Viva&nbsp;La&nbsp;Vida', altSingerPath: 'Coldplay', imgPath: 'https://img3.doubanio.com/lpic/s3054604.jpg', musicPath: 'https://cdn.rawgit.com/HUAMENGDIGUO/HUAMENGDIGUO.github.io/5d6aa504/source/music/Coldplay%20-%20Viva%20la%20Vida.mp3', index: '1'},
        {altSingNamePath: '1965', altSingerPath: 'Zella&nbsp;Day', imgPath: 'https://img1.doubanio.com/lpic/s27448489.jpg', musicPath: 'http://music.163.com/song/media/outer/url?id=28798452.mp3', index: '2'},
        {altSingNamePath: 'We&nbsp;Choose&nbsp;To&nbsp;Go&nbsp;To&nbsp;The&nbsp;Moon', altSingerPath: "There's&nbsp;a&nbsp;Light", imgPath: 'https://img3.doubanio.com/lpic/s11173705.jpg', musicPath: 'http://music.163.com/song/media/outer/url?id=4405800.mp3', index: '3'},
        {altSingNamePath: 'My&nbsp;Heart&nbsp;Will&nbsp;Go&nbsp;On', altSingerPath: 'Celine&nbsp;Dion', imgPath: 'https://img3.doubanio.com/lpic/s2727866.jpg', musicPath: 'http://music.163.com/song/media/outer/url?id=2308499.mp3', index: '4'},
    ]
    return information
}

//插入歌曲信息
const insertMusic = (message) => {
    let altSingNamePath = message.altSingNamePath
    let altSingerPath = message.altSingerPath
    let imgPath = message.imgPath
    let musicPath = message.musicPath
    let altPath = altSingNamePath + '&nbsp;-&nbsp;' + altSingerPath
    let index = message.index
    let indexPlusOne = Number(message.index) + 1

    let t = `
        <li id="yqkplayer-music-${index}" class="yqkplayer-list-light" data-img=${imgPath} data-alt=${altPath} data-music=${musicPath} data-index=${index}>
            <div id="cur-${index}" class="yqkplayer-list-cur yqkplayer-list-redcur"></div>
            <span class="yqkplayer-list-index">${indexPlusOne}</span>
            <div class="yqkplayer-pic" style="background-image: url(${imgPath});"></div>
            <div class="yqkplayer-list-ta">
                <span class="yqkplayer-list-title">${altSingNamePath}</span>
                <span class="yqkplayer-list-author">${altSingerPath}</span>
            </div>
        </li>
    `
    let element = e('#yqkplayerMusiclist')
    appendHtml(element, t)
}

//拖拽歌曲
const sortableMusiclist = () => {
    Sortable.create(yqkplayerMusiclist, {
        group: 'yqkplayerMusiclist',
        animation: 100,
        ghostClass: "sortable-ghost"
    });
}

//点击歌曲列表播放歌曲
const showPicAndAduioSrc = (audio, dataImg, dataAlt, dataMusic) => {
    let pic = e('#yqkplayer-img')
    pic.src = dataImg
    pic.alt = dataAlt
    audio.src = dataMusic
}

const showRedcurAndIndex = (dataIndex) => {
    removeClassAll('yqkplayer-list-redcur')
    let curSelector = '#cur-' + String(dataIndex)
    let curcator = e(curSelector)
    curcator.classList.add('yqkplayer-list-redcur')
    let musicList = e('#yqkplayerMusiclist')
    musicList.dataset.active = dataIndex
}

const showPlayIconAndMusicInformation = (dataAlt) => {
    variableInnerHtml('.yqkplayer-title', dataAlt.split('-')[0])
    variableInnerHtml('.yqkplayer-author', dataAlt.split('-')[1])
    classRemoveAdd('#yqkplayer', 'flip', 'yqkplayer')
    showPlayIcon()
}

const showMusic = (audio, dataImg, dataAlt, dataMusic, dataIndex) => {
    showPicAndAduioSrc(audio, dataImg, dataAlt, dataMusic)
    showRedcurAndIndex(dataIndex)
    showPlayIconAndMusicInformation(dataAlt)
}

const bindEventMusicList = (img, audio) => {
    let musicList = es('.yqkplayer-list-light')
    bindAll(musicList, 'click', function(event) {
        var self = event.currentTarget
        let dataImg = self.dataset.img
        let dataAlt = self.dataset.alt
        log('歌曲', dataAlt)
        let dataMusic = self.dataset.music
        let dataIndex = self.dataset.index

        showMusic(audio, dataImg, dataAlt, dataMusic, dataIndex)
        audio.play()
    })
}

const insertHtml = (data, img, audio) => {
    for (var i = 0; i < data.length; i++) {
        insertMusic(data[i])
    }
    log('歌曲加载完成')
    bindEventMusicList(img, audio)
}

//随机播放
const allSongs = (message) => {
    let songs = []
    for (var i = 0; i < message.length; i++) {
        var m = message[i]
        var path = m.musicPath
        songs.push(path)
    }
    return songs
}

const choice = (array) => {
    let randomNumber = Math.random()
    let number = randomNumber * array.length
    let index = Math.floor(number)
    return index
}

const randomSongIndex = (data) => {
    let songs = allSongs(data)
    let i = choice(songs)
    return i
}

const bindEventEndRandomSong = (audio, data) => {
    bindEvent(audio, 'ended', function(event) {
        let musiclist = e('#yqkplayerMusiclist')
        myDoItRandom(audio, data, musiclist)
    })
}

//列表循环
const playMusicAtIndex = (audio, i) => {
    let nextindex = i
    log('playMusicAtIndex', nextindex)
    let nextSelector = '#yqkplayer-music-' + nextindex
    let nextElement = e(nextSelector)
    showPicAndAduioSrc(audio, nextElement.dataset.img, nextElement.dataset.alt, nextElement.dataset.music)
    variableInnerHtml('.yqkplayer-title', nextElement.dataset.alt.split('-')[0])
    variableInnerHtml('.yqkplayer-author', nextElement.dataset.alt.split('-')[1])
}

const bindEventEndListloopSong = (audio) => {
    bindEvent(audio, 'ended', function(event) {
        let musiclist = e('#yqkplayerMusiclist')
        let offset = e('#forward')
        myDoItListloop(audio, musiclist, offset)
    })
}

const nextIndex = (slide, element) => {
    let totality = Number(slide.dataset.totality)
    let activeIndex = Number(slide.dataset.active)
    let offset = Number(element.dataset.offset)
    let index = (activeIndex + offset + totality) % totality
    slide.dataset.active = index
    return index
}

const myDoItListloop = async function doIt(audio, slide, element) {
    try {
        const a1 = await nextIndex(slide, element);
        log('歌曲index', a1)
        const a2 = await playMusicAtIndex(audio, a1)
        const a3 = await audio.play()
    } catch (err) {
        log(err);
    }
}

const myDoItRandom = async function doIt(audio, data, element) {
    try {
        const a1 = await randomSongIndex(data);
        log('歌曲index', a1)
        const a2 = await playMusicAtIndex(audio, a1)
        const a3 = await audio.play()
    } catch (err) {
        log(err);
    }
}

const FlipOfYQkplayer = () => {
    Flip_Y_front()
    Flip_Y_opposite()
    bindEventRedHeartIcon()
    bindEventVolumeProgressBar()
    sortableMusiclist()
}

const bindEventsWithAudio = (audio, data) => {
    bindEventPlayandPause(audio)
    bindEventChangePlayMode(audio, data)
    bindEventVolumeIcon(audio)
    bindEventNextSong(audio)
    bindEventBackwardSong(audio)
    bindEventCanplay(audio)
}

const functionOfYQkplayer = () => {
    const audio = e('#audio')
    const img = e('#yqkplayer-img')
    const data = dataBase()
    insertHtml(data, img, audio)

    FlipOfYQkplayer()
    bindEventsWithAudio(audio, data)
}

//背景轮播图
const bindEventSlide = () => {
    var elements = es('.fa-chevron')
    bindAll(elements, 'click', function(event) {
        var self = event.target
        let slide = e('#background')
        let index = nextIndex(slide, self)
        showImageAtIndex(slide, index)
    })
}

//小圆点的播放效果
const showNextClass = (classSelector, prefixed, nextIndex) => {
    // 1. 删除当前小圆点的 class
    removeClassAll(classSelector)
    // 2. 得到下一个小圆点的选择器
    let nextSelector = prefixed + String(nextIndex)
    let element = e(nextSelector)
    element.classList.add(classSelector)
}

const showImageAtIndex = (slide, index) => {
    let nextIndex = index
    slide.dataset.active = nextIndex
    showNextClass('active', '#yqkplayer-background-img-', nextIndex)
    showNextClass('article', '#section-', nextIndex)
}

const bindEventIndicator = () => {
    var elements = es('.article-section')
    bindAll(elements, 'click', function(event) {
        var self = event.target
        let index = Number(self.dataset.index)
        let slide = e('#background')
        // 直接播放第 n 张图片
        showImageAtIndex(slide, index)
    })
}

const playNextImage = () => {
    let slide = e('#background')
    // 求出下一张图片的 index
    let element = e('.fa-chevron-right')
    let index = nextIndex(slide, element)
    showImageAtIndex(slide, index)
}

//拖拽小圆点
const sortableArticleLeft = () => {
    Sortable.create(articleLeft, {
        group: {
          name: 'articleLeft',
          put: ['articleRight']
        },
        animation: 100,
        ghostClass: "sortable-ghost"
    });
}

const sortableArticleRight = () => {
    Sortable.create(articleRight, {
        group: {
          name: 'articleRight',
          put: ['articleLeft']
        },
        animation: 100,
        ghostClass: "sortable-ghost"
    });
}

const autoPlay = () => {
    let interval = 6000
    setInterval(function() {
        playNextImage()
    }, interval)
}

const functionOfCarouselFigure = () => {
    bindEventSlide()
    bindEventIndicator()
    autoPlay()
    sortableArticleLeft()
    sortableArticleRight()
}

const _main = () => {
    functionOfYQkplayer()
    functionOfCarouselFigure()
}

_main()
