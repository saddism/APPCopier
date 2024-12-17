import cv2
import os

def extract_frames(video_path, output_dir):
    """从视频文件中提取帧"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    cap = cv2.VideoCapture(video_path)
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        output_path = os.path.join(output_dir, f'frame_{str(frame_count).zfill(4)}.jpg')
        cv2.imwrite(output_path, frame)

    cap.release()
    return frame_count

if __name__ == '__main__':
    video_path = os.path.expanduser('~/attachments/ScreenRecording_12-17-2024+08-12-07_1.MP4')
    frames_dir = 'frames'

    if os.path.exists(video_path):
        print(f'正在从视频提取帧...')
        num_frames = extract_frames(video_path, frames_dir)
        print(f'已提取 {num_frames} 帧到 {frames_dir} 目录')
    else:
        print('未找到视频文件')
