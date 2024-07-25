import React from "react";

export default function Tiaoyin() {
  return (
    <div class="tiaoyin">
      <div class="tiaoyin-dashboard">
        {/* <ec-canvas ec="{{ ec }}" force-use-old-canvas="true"></ec-canvas> */}
      </div>
      <div class="xian-char">{xian[selectedXianId - 1].char}</div>
      <div class="tiaoyin-main">
        <div class="horizon-line"></div>
        <div class="descript">
          <p>
            正在调一弦，音名：{xian[selectedXianId - 1].char}，钢琴键位：
            {xian[selectedXianId - 1].char}，频率：
            {xian[selectedXianId - 1].freq}HZ
          </p>
        </div>
        <div class="tiaoyin-main-select">
          <div class="string-icons">
            <div style="visibility: {{ selectedXianId !== 1 ? 'hidden' : 'none' }};">
              <van-icon name="setting-o" size="60rpx" class="rotate" />
            </div>
            <div style="visibility: {{ selectedXianId !== 2 ? 'hidden' : 'none' }};">
              <van-icon name="setting-o" size="60rpx" class="rotate" />
            </div>
            <div style="visibility: {{ selectedXianId !== 3 ? 'hidden' : 'none' }};">
              <van-icon name="setting-o" size="60rpx" class="rotate" />
            </div>
            <div style="visibility: {{ selectedXianId !== 4 ? 'hidden' : 'none' }};">
              <van-icon name="setting-o" size="60rpx" class="rotate" />
            </div>
            <div style="visibility: {{ selectedXianId !== 5 ? 'hidden' : 'none' }};">
              <van-icon name="setting-o" size="60rpx" class="rotate" />
            </div>
            <div style="visibility: {{ selectedXianId !== 6 ? 'hidden' : 'none' }};">
              <van-icon name="setting-o" size="60rpx" class="rotate" />
            </div>
            <div style="visibility: {{ selectedXianId !== 7 ? 'hidden' : 'none' }};">
              <van-icon name="setting-o" size="60rpx" class="rotate" />
            </div>
          </div>
          <div class="string-titles">
            <div
              class="string-title"
              wx:for="{{ xian }}"
              wx:key="id"
              bind:tap="selectXian"
              data-id="{{item.id}}"
            >
              <text>{item.name}</text>
            </div>
          </div>
          <div class="tiaoyin-container">
            <div
              class="string"
              wx:for="{{ xian }}"
              wx:key="id"
              bind:tap="selectXian"
              data-id="{{item.id}}"
            >
              <div
                class="vertical-line"
                style="border-right: {{ selectedXianId !== item.id ? '8rpx solid rgba(255, 255, 255, 0.6)' : '8rpx solid rgba(255, 255, 255, 0.9)'}}"
              ></div>
              <div
                class="tiaoyin-string-text"
                style="background-color: {{ selectedXianId !== item.id ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.9)'}}"
              >
                {item.char}
              </div>
            </div>
          </div>
        </div>
        <div class="tiaoyin-fq">
          <text>频率设置(Hz):</text>
          <slider
            min="390"
            max="440"
            show-value="true"
            class="tiaoyin-slider"
          ></slider>
        </div>
        <div class="switch-mode">
          <text>切换模式:</text>
          <van-button
            type="primary"
            custom-style="padding: 0 70rpx; height: 50rpx;"
          >
            正调
          </van-button>
          <van-button type="default" custom-style="height: 50rpx;" round>
            节拍器
          </van-button>
        </div>
      </div>
    </div>
  );
}
