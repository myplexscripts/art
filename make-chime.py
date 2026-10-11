#!/usr/bin/env python3
"""Render the original Scenes chime; requires NumPy, SciPy and ffmpeg."""
import argparse
import subprocess
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

RATE = 44100
DURATION = 7.2
NOTES = ((0.06, 293.6648, 1.0, -0.10),
         (0.49, 440.0, 0.87, 0.08),
         (0.94, 587.3295, 0.74, 0.0))  # D4, A4, D5: an open, gentle rise.


def render():
    dry = np.zeros((round(RATE * DURATION), 2), dtype=np.float64)
    for onset, frequency, gain, pan in NOTES:
        start = round(onset * RATE)
        time = np.arange(len(dry) - start) / RATE
        attack = 1 - np.exp(-np.square(time / 0.028))
        voice = np.zeros_like(time)
        # The high partials fade first, leaving a warm, soft ring rather than a ping.
        for ratio, level, decay in ((1, 1, 1.22), (2, 0.22, 0.83),
                                    (2.756, 0.042, 0.42), (4.012, 0.014, 0.29)):
            phase = 2 * np.pi * frequency * ratio * time
            voice += level * np.sin(phase) * np.exp(-time / decay)
        voice *= attack * gain
        angle = (pan + 1) * np.pi / 4
        dry[start:, 0] += voice * np.cos(angle)
        dry[start:, 1] += voice * np.sin(angle)

    # A deterministic, diffuse room response; no recorded samples or added hiss.
    rng = np.random.default_rng(20261011)
    room_time = np.arange(round(RATE * 3.2)) / RATE
    wet = np.zeros_like(dry)
    room_filter = butter(2, (160, 2800), btype='bandpass', fs=RATE, output='sos')
    for channel in range(2):
        response = sosfilt(room_filter, rng.standard_normal(len(room_time)))
        response *= np.exp(-room_time / 0.78) * (1 - np.exp(-room_time / 0.035))
        response[:round(RATE * 0.035)] = 0
        response /= np.sqrt(np.sum(response ** 2))
        # Both channels share the dry notes; the quiet room reflections differ.
        wet[:, channel] = fftconvolve(dry.mean(axis=1), response)[:len(dry)]

    audio = dry + 0.20 * wet
    audio = sosfilt(butter(2, 3500, fs=RATE, output='sos'), audio, axis=0)
    tail = round(RATE * 1.2)
    audio[-tail:] *= np.cos(np.linspace(0, np.pi / 2, tail))[:, None] ** 2
    # Leave generous headroom. No compression, hard clipping or abrupt endpoints.
    audio *= 10 ** (-9 / 20) / np.max(np.abs(audio))
    audio[0] = audio[-1] = 0
    return audio


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path,
                        default=Path(__file__).resolve().parent / 'live' / 'audio')
    directory = parser.parse_args().output
    directory.mkdir(parents=True, exist_ok=True)
    audio = render()
    wav = directory / 'scenes-chime.wav'
    mp3 = directory / 'scenes-chime.mp3'
    wavfile.write(wav, RATE, np.rint(audio * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
                    '-i', str(wav), '-map_metadata', '-1', '-codec:a', 'libmp3lame',
                    '-b:a', '192k', '-metadata', 'title=Scenes — Soft Arrival',
                    '-metadata', 'artist=Scenes', str(mp3)], check=True)
    print(f'Created {wav} and {mp3}: {DURATION}s, stereo, {RATE} Hz, -9 dBFS peak.')


if __name__ == '__main__':
    main()
