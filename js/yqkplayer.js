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
        let percent = (currentTime / duration) * 100
        input.style.background = `linear-gradient(90deg, #e2e2e2, #db1103 ${percent}%, #db1103 ${percent}%, #e2e2e2 0%)`;
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
    let v = input.value
    audio.currentTime = v
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
const bindEventNextSong = (audio) => {
    let forward = e('#forward')
    bindEvent(forward, 'click', function(event) {
        var self = event.target
        let musiclist = e('#yqkplayer-musiclist')
        let index = nextIndex(musiclist, self)
        playMusicAtIndex(audio, musiclist, index)
    })
}

//后退一首
const bindEventBackwardSong = (audio) => {
    let backward = e('#backward')
    bindEvent(backward, 'click', function(event) {
        var self = event.target
        let musiclist = e('#yqkplayer-musiclist')
        let index = nextIndex(musiclist, self)
        playMusicAtIndex(audio, musiclist, index)
    })
}

//红心操作
const bindEventRedHeartIcon = () => {
    var redheart = es('.fa-heart')
    bindAll(redheart, 'click', function(event) {
        var self = event.target
        removeClassAll('seenothing')
        self.classList.add('seenothing')
    })
}

//播放模式切换
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
const bindEventVolumeProgressBar = () => {
    let input = e('#volumeInput')
    let audio = e('#audio')
    let v = input.value
    audio.volume = v
    let percent = (input.value / input.max) * 100
    input.style.background = `linear-gradient(90deg, #e2e2e2, #db1103 ${percent}%, #db1103 ${percent}%, #e2e2e2 0%)`;
}

const changeVolumeInput = (input, audio) => {
    input.value = audio.volume
    let percent = (input.value / input.max) * 100
    input.style.background = `linear-gradient(90deg, #e2e2e2, #db1103 ${percent}%, #db1103 ${percent}%, #e2e2e2 0%)`;
}

//音量图标操作
const bindEventVolumeIcon = (audio) => {
    let element = e('#volume')
    let input = e('#volumeInput')
    bindEvent(element, 'click', function(event) {
        if (audio.volume != 0) {
            audio.volume = 0
            classRemoveAdd('#volume', 'fa-volume-up', 'fa-volume-off')
            changeVolumeInput(input, audio)
        } else {
            log('audio.volume', audio.volume)
            audio.volume = 1
            classRemoveAdd('#volume', 'fa-volume-off', 'fa-volume-up')
            changeVolumeInput(input, audio)
        }
    })
}

//歌曲信息库
const dataBase = () => {
    let information = [
        {altSingNamePath: 'Star&nbsp;Sky', altSingerPath: 'Two&nbsp;Steps&nbsp;From&nbsp;Hell', imgPath: 'https://img3.doubanio.com/lpic/s28060765.jpg', musicPath: 'http://music.163.com/song/media/outer/url?id=31654478.mp3', index: '0'},
        {altSingNamePath: 'Viva&nbsp;La&nbsp;Vida', altSingerPath: 'Coldplay', imgPath: 'https://img3.doubanio.com/lpic/s3054604.jpg', musicPath: 'http://music.163.com/song/media/outer/url?id=3986017.mp3', index: '1'},
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
    let element = e('#yqkplayer-musiclist')
    appendHtml(element, t)
}

//点击歌曲列表播放歌曲
const bindEventMusicList = (img, audio) => {
    let MusicList = es('.yqkplayer-list-light')
    let pic = e('#yqkplayer-img')
    bindAll(MusicList, 'click', function(event) {
        var self = event.currentTarget
        let dataImg = self.dataset.img
        let dataAlt = self.dataset.alt
        log('歌曲', dataAlt)
        let dataMusic = self.dataset.music
        let dataIndex = self.dataset.index
        let play = e('#play')

        pic.src = dataImg
        pic.alt = dataAlt
        audio.src = dataMusic

        removeClassAll('yqkplayer-list-redcur')
        let curSelector = '#cur-' + String(dataIndex)
        let curcator = e(curSelector)
        curcator.classList.add('yqkplayer-list-redcur')

        variableInnerHtml('.yqkplayer-title', dataAlt.split('-')[0])
        variableInnerHtml('.yqkplayer-author', dataAlt.split('-')[1])
        classRemoveAdd('#yqkplayer', 'flip', 'yqkplayer')
        if (play.classList.contains('fa-play')) {
            classRemoveAdd('#play', 'fa-play', 'fa-pause')
        }
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
        let musiclist = e('#yqkplayer-musiclist')
        myDoItRandom(audio, data, musiclist)
    })
}

//列表循环
const playMusicAtIndex = (audio, slide, i) => {
    let nextindex = i
    log('playMusicAtIndex', nextindex)
    let nextSelector = '#yqkplayer-music-' + nextindex
    let nextElement = e(nextSelector)
    let pic = e('#yqkplayer-img')
    audio.src = nextElement.dataset.music
    pic.src = nextElement.dataset.img
    pic.alt = nextElement.dataset.alt
    variableInnerHtml('.yqkplayer-title', nextElement.dataset.alt.split('-')[0])
    variableInnerHtml('.yqkplayer-author', nextElement.dataset.alt.split('-')[1])
    if (play.classList.contains('fa-play')) {
        classRemoveAdd('#play', 'fa-play', 'fa-pause')
    }
}

const bindEventEndListloopSong = (audio) => {
    bindEvent(audio, 'ended', function(event) {
        let musiclist = e('#yqkplayer-musiclist')
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
        const a2 = await playMusicAtIndex(audio, slide, a1)
        const a3 = await audio.play()
    } catch (err) {
        log(err);
    }
}

const myDoItRandom = async function doIt(audio, data, element) {
    try {
        const a1 = await randomSongIndex(data);
        log('歌曲index', a1)
        const a2 = await playMusicAtIndex(audio, element, a1)
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
}

const functionOfYQkplayer = () => {
    const audio = e('#audio')
    const img = e('#yqkplayer-img')
    const data = dataBase()
    insertHtml(data, img, audio)

    FlipOfYQkplayer()

    bindEventPlayandPause(audio)
    bindEventChangePlayMode(audio, data)
    bindEventVolumeIcon(audio)

    bindEventNextSong(audio)
    bindEventBackwardSong(audio)
    bindEventCanplay(audio)
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

const showImageAtIndex = (slide, index) => {
    let nextIndex = index
    slide.dataset.active = nextIndex
    let a = 'active'
    removeClassAll(a)
    let nextSelector = '#yqkplayer-background-img-' + String(nextIndex)
    let element = e(nextSelector)
    element.classList.add(a)
    // 切换小圆点
    // 1. 删除当前小圆点的 class
    let className = 'article'
    removeClassAll(className)
    // 2. 得到下一个小圆点的选择器
    let indicatorSelector = '#section-' + String(nextIndex)
    let indicator = e(indicatorSelector)
    indicator.classList.add(className)
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
}

const _main = () => {
    functionOfYQkplayer()
    functionOfCarouselFigure()
}

_main()
