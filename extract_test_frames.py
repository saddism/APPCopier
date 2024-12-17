import cv2
import os

def extract_test_frames(video_path, output_dir, num_frames=10):
    """从视频中提取指定数量的测试帧"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    cap = cv2.VideoCapture(video_path)
    frame_count = 0

    while frame_count < num_frames:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        output_path = os.path.join(output_dir, f'frame_{str(frame_count).zfill(4)}.jpg')
        cv2.imwrite(output_path, frame)
        print(f'已保存帧 {frame_count}')

    cap.release()
    print(f'共提取 {frame_count} 帧测试图像')
    return frame_count

if __name__ == '__main__':
    video_path = os.path.expanduser('~/attachments/ScreenRecording_12-17-2024+08-12-07_1.MP4')
    frames_dir = 'frames'

    if os.path.exists(video_path):
        print(f'正在从视频提取测试帧...')
        num_frames = extract_test_frames(video_path, frames_dir)
        print(f'测试帧提取完成，保存在 {frames_dir} 目录')
    else:
        print('未找到视频文件')
