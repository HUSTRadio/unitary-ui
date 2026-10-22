"""Capture only the explicitly selected virtual X11 test display as RGBA PNG.

Uses Ubuntu's existing Xlib and Python standard library; no product dependency.
The caller must opt into its isolated Xvfb session.
"""
import ctypes as c
import os
import struct
import sys
import zlib

if os.environ.get("UNITARY_NATIVE_GLASS_XVFB") != "1" or not os.environ.get("DISPLAY"):
    raise RuntimeError("Native capture requires the isolated Xvfb test session")

xlib = c.CDLL("libX11.so.6")
xlib.XOpenDisplay.argtypes = [c.c_char_p]
xlib.XOpenDisplay.restype = c.c_void_p
xlib.XDefaultScreen.argtypes = [c.c_void_p]
xlib.XDefaultScreen.restype = c.c_int
xlib.XRootWindow.argtypes = [c.c_void_p, c.c_int]
xlib.XRootWindow.restype = c.c_ulong
for name in ["XDisplayWidth", "XDisplayHeight"]:
    getattr(xlib, name).argtypes = [c.c_void_p, c.c_int]
    getattr(xlib, name).restype = c.c_int


class XImage(c.Structure):
    _fields_ = [(name, c.c_int) for name in ["width", "height", "xoffset", "format"]] + [
        ("data", c.c_void_p),
    ] + [(name, c.c_int) for name in [
        "byte_order", "bitmap_unit", "bitmap_bit_order", "bitmap_pad", "depth", "bytes_per_line", "bits_per_pixel",
    ]]


xlib.XGetImage.argtypes = [c.c_void_p, c.c_ulong, c.c_int, c.c_int, c.c_uint, c.c_uint, c.c_ulong, c.c_int]
xlib.XGetImage.restype = c.POINTER(XImage)
xlib.XDestroyImage.argtypes = [c.POINTER(XImage)]
xlib.XCloseDisplay.argtypes = [c.c_void_p]
display = xlib.XOpenDisplay(None)
if not display:
    raise RuntimeError("Cannot open the Xvfb display")
image = None
try:
    screen = xlib.XDefaultScreen(display)
    width = xlib.XDisplayWidth(display, screen)
    height = xlib.XDisplayHeight(display, screen)
    image = xlib.XGetImage(display, xlib.XRootWindow(display, screen), 0, 0, width, height, c.c_ulong(-1), 2)
    if not image:
        raise RuntimeError("Xvfb display readback failed")
    pixels = image.contents
    if pixels.bits_per_pixel != 32 or pixels.bytes_per_line != width * 4 or pixels.byte_order != 0:
        raise RuntimeError("Unsupported Xvfb pixel format")
    raw = c.string_at(pixels.data, width * height * 4)
    rgba = bytearray(len(raw))
    rgba[0::4], rgba[1::4], rgba[2::4] = raw[2::4], raw[1::4], raw[0::4]
    rgba[3::4] = bytes([255]) * (width * height)
    scanlines = b"".join(bytes([0]) + rgba[row * width * 4:(row + 1) * width * 4] for row in range(height))

    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)

    sys.stdout.buffer.write(bytes([137, 80, 78, 71, 13, 10, 26, 10])
                            + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
                            + chunk(b"IDAT", zlib.compress(scanlines)) + chunk(b"IEND", b""))
finally:
    if image:
        xlib.XDestroyImage(image)
    xlib.XCloseDisplay(display)
