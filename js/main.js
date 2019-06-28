window.onload = function() {
	var list = document.getElementById('myList');
	var listChild = document.getElementsByTagName('li');

	var id = getnavivalues()["case_id"];
	var type = getnavivalues()["type"];
	if(id != undefined && id != null) {
		var url = "https://www.homeeyes.cn/api/artDetail";
		var param = "case_id=" + id + "&type=" + type;

		ajax_method(url, param, "post", function(data) {

			var images = data.data.images;
			console.log(images)
			if(images != undefined && images.length > 0) {
				setImg(images[0]);
				list.innerHTML = "";
				for(var i = 0; i < images.length; i++) {
					var para = document.createElement("li");
					var img = document.createElement("img");
					img.src = images[i];
					img.className = "meun_img";
					img.addEventListener('click', function() {
						var url = this.src;
						console.log(url)
						setImg(url);

					}, false);
					para.appendChild(img);
					list.appendChild(para);

				}

			} else {
				loadPredefinedPanorama();
			}
		});
	} else {
		for(var i = 0; i < listChild.length; i++) {
			listChild[i].addEventListener('click', function() {
				var url = this.children[0].currentSrc;
				setImg(url);

			}, false);
		}
		loadPredefinedPanorama();
	}

	var clickfile = document.getElementById("clickfile");
	clickfile.addEventListener('click', clickFile, false);
	document.getElementById('pano').addEventListener('change', upload, false);
};

function clickFile() {
	document.getElementById('pano').click()
}
// Load the predefined panorama
function loadPredefinedPanorama(evt) {
	if(evt != undefined) {
		evt.preventDefault();
	}
	setImg("img/banner1.jpg");
}

function setImg(url) {
	var height = document.documentElement.clientHeight + "px";
	var div = document.getElementById('container');
	//	var masking=document.getElementById("masking");
	//	masking.style.display="block";
	var PSV = new PhotoSphereViewer({
		// Path to the panorama
		panorama:["img/banner1.jpg","img/banner2.jpg","img/banner3.jpg"],

		// Container
		container: div,
		// Deactivate the animation
		time_anim: true,
		transition: {
			duration: 200, // duration of transition in milliseconds
			loader: true // should display the loader ?
		},
		// Display the navigation bar
		navbar: true,
		min_fov: '180',
		// Resize the panorama
		size: {
			width: '100%',
			height: height
		},
		markers: [ //在图片中加图片表示，比如地图图标，对话
			{
				id: 'image',
				longitude: 100,
				latitude: 0,
				image: 'img/icon_cell.png',
				width: 100,
				height: 100,
				anchor: 'bottom center'
			},
			{
				// html marker with custom style
				id: 'text',
				longitude: 0,
				latitude: 0,
				html: 'HTML <b>marker</b> &hearts;',
				anchor: 'bottom right',
				scale: [0.5, 1.5],
				style: {
					maxWidth: '100px',
					color: 'white',
					fontSize: '20px',
					fontFamily: 'Helvetica, sans-serif',
					textAlign: 'center'
				},
				tooltip: {
					content: 'An HTML marker',
					position: 'right'
				}
			},
		],

		onready: function() {
			//			masking.style.display="none";
		}
	});
	PSV.on('ready', function() {
		PSV.rotate({
			x: 1500,
			y: 1000
		});
	});
	/**
	 * Create a new marker when the user clicks somewhere
	 */
	PSV.on('click', function(e) {
		PSV.addMarker({
			id: '#' + Math.random(),
			longitude: e.longitude,
			latitude: e.latitude,
			image: 'img/icon_cell.png',
			width: 32,
			height: 32,
			anchor: 'bottom center',
			tooltip: 'Generated pin',
			data: {
				generated: true
			}
		});
	});

	/**
	 * Delete a generated marker when the user clicks on it
	 */
	PSV.on('select-marker', function(marker) {
		if(marker.data && marker.data.generated) {
			PSV.removeMarker(marker);
		}
	});
	psv.on('panorama-loaded', function() {
		$('.hint-container').css('display', 'block');
		$('.btn-container').css('display', 'block');

	})

}
// Load a panorama stored on the user's computer
function upload() {
	// Retrieve the chosen file and create the FileReader object
	var file = document.getElementById('pano').files[0];
	var reader = new FileReader();
	console.log(file);
	reader.onload = function() {
		setImg(reader.result);

	};

	reader.readAsDataURL(file);
}

function getnavivalues() {
	var url = location.search; //获取url中"?"符后的字串  
	var theRequest = new Array();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

function ajax_method(url, data, method, success) {
	// 异步对象
	var ajax = new XMLHttpRequest();

	// get 跟post  需要分别写不同的代码
	if(method == 'get') {
		// get请求
		if(data) {
			// 如果有值
			url += '?';
			url += data;
		} else {

		}
		// 设置 方法 以及 url
		ajax.open(method, url);

		// send即可
		ajax.send();
	} else {
		// post请求
		// post请求 url 是不需要改变
		ajax.open(method, url);

		// 需要设置请求报文
		ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		// 判断data send发送数据
		if(data) {
			// 如果有值 从send发送
			ajax.send(data);
		} else {
			// 木有值 直接发送即可
			ajax.send();
		}
	}

	// 注册事件
	ajax.onreadystatechange = function() {
		// 在事件中 获取数据 并修改界面显示
		if(ajax.readyState == 4 && ajax.status == 200) {
			// console.log(ajax.responseText);

			// 将 数据 让 外面可以使用
			// return ajax.responseText;

			// 当 onreadystatechange 调用时 说明 数据回来了
			// ajax.responseText;

			// 如果说 外面可以传入一个 function 作为参数 success
			var obj = JSON.parse(ajax.responseText);
			success(obj);
		}
	}

}