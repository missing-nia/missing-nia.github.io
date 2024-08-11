class LightBoxVideo {
    constructor() {
        this.videos = {};
        this.lightBoxVideo();
    }

    lightBoxVideo = () => {
        this.setEvents();
        this.setMutationObserver();
    }

    setMutationObserver = () => {
        const observer = new MutationObserver(mutation => {
            const imageMutations = mutation.filter((m) => {
                return m.attributeName === "src" && m.target.className === 'lb-image'
            });

            const overlayDisplay = window.getComputedStyle(document.querySelector('.lightboxOverlay'), null).display;
            if ("none" === overlayDisplay) {
                this.removeVideoElement();
            }

            if (imageMutations.length > 0) {
                if (this.videos[imageMutations[0].target.src]) {
                    this.removeVideoElement();
                    this.setVideoElement(this.videos[imageMutations[0].target.src]);
                }
            }
        });

        observer.observe(document.body, {
            childList: false,
            attributes: true,
            subtree: true,
            characterData: false
        });
    }

    setEvents = () => {
        const videoLinks = this.findVideoLinks();
        videoLinks.forEach((link) => {
            this.videos[link.href] = link;
            link.addEventListener('click', (e) => {
                this.removeVideoElement();
                this.setVideoElement(e.target);
            });
        });
    }

    setVideoElement = (element) => {
        const lightbox = document.querySelector('.lightbox')
        const container = lightbox.querySelector('.lb-container');

        const videoElement = this.createVideoElement(element);
        container.prepend(videoElement);
    }

    removeVideoElement = () => {
        const lightbox = document.querySelector('.lightbox')
        const container = lightbox.querySelector('.lb-container');
        const video = container.querySelector('video');

        if (video) {
            container.removeChild(video);
        }
    }

    createVideoElement = (element) => {
        const video = document.createElement('video');

        video.setAttribute('poster', element.href);
        video.setAttribute('controls', 'true');

        const source = document.createElement('source');
        source.setAttribute('src', element.dataset.href);
        source.setAttribute('type', 'video/mp4');

        video.append(source);

        return video;
    }

    findVideoLinks = () => {
        const hrefs = document.querySelectorAll('a[data-href]');
        const regex = /\.(mp4|mov|flv|wmv)$/;
        if (0 === hrefs.length) {
            return [];
        }
        return Array.from(hrefs).filter((href) => {
            return !!href.dataset.href.match(regex);
        });
    }
} 


window.addEventListener('DOMContentLoaded', () => {
    new LightBoxVideo();
});