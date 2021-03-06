import './feeds.css';
import Vue from 'vue/dist/vue.js';

let { mapState, mapMutations, mapActions } = Vuex;

Vue.component('feeds', {
	computed: {
		...mapState({
			params: 'params',
			platIcon: 'platIcon',
			feedsList: state => state.feeds.feedsList,
			prevPlayer: state => state.feeds.prevPlayer,
			currentPlayer: state => state.feeds.currentPlayer
		})
	},
	template: `<div class="feeds">
				<div class="feeds-item" v-for="item in feedsList">
					<div class="feeds-author overflow">
						<div class="feeds-avatar l bg-img">
							<div class="bg-img" :style="{backgroundImage: 'url('+item.author.avatar+')'}"></div>
							<img class="plat-icon" :src="platIcon[item.author.platform]" />
						</div>
						<div class="l">
							<p class="f-15 f-bold" style="margin:8px 0 2px 0;">{{item.author.nickname}}</p>
							<p class="c-9b">{{formatTime(item.publishTime)}}</p>
						</div>
					</div>
					<div class="feeds-media">
						<div v-if="item.postType=='image'" v-for="item0 in item.feedsMatrix" class="feeds-media-row overflow">
							<div v-for="item1 in item0" 
								:class="[item.images.length > 2 ? 'media-item-3' : (item0.length == 1 ? 'media-item-1' : 'media-item-2'), 'feeds-media-item', 'bg-img', 'l']"
								:style="{backgroundImage: 'url('+item1.imageSpec[1].url+')'}"
							>
							</div>
						</div>
						<div @click="handlePlay(item.postId, $event)" v-if="item.postType=='video'" class="feeds-media-row overflow">
							<div v-show="currentPlayer!=item.postId" class="feeds-media-item media-item-1 bg-img"
								:style="{backgroundImage: 'url('+item.video.coverUrl+')'}"
							>
								<img class="play-icon" src="${require('../../images/play.png')}" />
							</div>
							<video v-show="currentPlayer==item.postId" controls="controls" preload="preload" :src="item.video.videoUrl"></video>
						</div>
					</div>
					<p class="f-15 c-47 lh-130" style="margin-bottom: 18px;">{{item.content}}</p>
					<div class="overflow feeds-contral">
						<img class="l" src="${require('../../images/like.png')}" />
						<span class="c-47 f-bold l" style="margin-right: 23px;">{{item.likeCount}}</span>
						<img class="l" src="${require('../../images/comment.png')}" />
						<span class="c-47 f-bold l">{{item.commentCount}}</span>
					</div>
					<div class="comment-list" v-if="item.hotComments.length > 0">
						<ul>
							<li class="overflow" v-for="item0 in item.hotComments">
								<div class="comment-avatar l bg-img">
									<div class="bg-img" :style="{backgroundImage: 'url('+item0.author.avatar+')'}"></div>
								</div>
								<p style="width: 70%;" class="l f-14 c-47 text-overflow"><span class="f-1b f-bold">{{item0.author.name}}：</span>{{item0.text}}</p>
							</li>
						</ul>
						<a @click="handleDownload" href="tanqu://home/test?p=12&d=1"><p v-if="Number(item.commentCount) > 3" class="c-47" style="margin-top:2px;">查看所有{{item.commentCount}}条评论 &gt;</p></a>
					</div>
				</div>
			  </div>`,
	methods: {
		handlePlay(postId, e) {
			let data = {
				postId: postId,
				videoTarget: e.currentTarget.querySelector('video')
			};
			this.handlePlayState(data);
		},
		formatTime(ms) {
			let date = new Date(ms),
			    str = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} / ${date.getHours()}:${date.getMinutes()}`;
			// console.log(str);
			return str;
		},
		...mapMutations(['createMatrix', 'testCallback', 'handlePlayState']),
		...mapActions(['server', 'handleDownload'])
	},
	created() {
		let data = this.params;
		this.server({
			data: data, 
			url: './src/json/post.json', 
			callback: (res) => {
				if (res.meta.statusCode == 200) {
					this.createMatrix(res.content);
				}
			}
		});
	}
});
