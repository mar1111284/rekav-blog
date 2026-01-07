#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <sys/stat.h>

#ifdef _WIN32
#include <direct.h>
#define MKDIR(dir) _mkdir(dir)
#else
#include <unistd.h>
#define MKDIR(dir) mkdir(dir, 0755)
#endif

#define TILE_COLS 16
#define TILE_ROWS 9
#define TOTAL_TILES (TILE_COLS * TILE_ROWS)

#define LARGE_W 720
#define LARGE_H 405

#define SMALL_W 320
#define SMALL_H 180

/* -------------------------------------------------- */
/* Nearest-neighbor resize (grayscale)                */
/* -------------------------------------------------- */
unsigned char* resize_gray(unsigned char* src, int sw, int sh, int dw, int dh) {
    unsigned char* dst = malloc(dw * dh);
    if (!dst) return NULL;

    for (int y = 0; y < dh; y++) {
        int sy = y * sh / dh;
        for (int x = 0; x < dw; x++) {
            int sx = x * sw / dw;
            dst[y * dw + x] = src[sy * sw + sx];
        }
    }
    return dst;
}

/* -------------------------------------------------- */
/* Process one image into tiles                       */
/* -------------------------------------------------- */
int process_image(
    const char* input_path,
    const char* output_folder,
    int final_w,
    int final_h
) {
    int w, h, c;
    unsigned char* img = stbi_load(input_path, &w, &h, &c, 0);
    if (!img) {
        printf("Failed to load %s\n", input_path);
        return 1;
    }

    /* Grayscale */
    unsigned char* gray = malloc(w * h);
    for (int i = 0; i < w * h; i++) {
        unsigned char r = img[i * c + 0];
        unsigned char g = img[i * c + 1];
        unsigned char b = img[i * c + 2];
        gray[i] = (unsigned char)(0.299f*r + 0.587f*g + 0.114f*b);
    }
    stbi_image_free(img);

    /* Crop largest centered 16:9 */
    float ratio = 16.0f / 9.0f;
    int cw = w;
    int ch = (int)(cw / ratio);

    if (ch > h) {
        ch = h;
        cw = (int)(ch * ratio);
    }

    int ox = (w - cw) / 2;
    int oy = (h - ch) / 2;

    unsigned char* crop = malloc(cw * ch);
    for (int y = 0; y < ch; y++) {
        memcpy(
            crop + y * cw,
            gray + (oy + y) * w + ox,
            cw
        );
    }
    free(gray);

    /* Resize */
    unsigned char* final = resize_gray(crop, cw, ch, final_w, final_h);
    free(crop);
    if (!final) return 1;

    int tile_w = final_w / TILE_COLS;
    int tile_h = final_h / TILE_ROWS;

    MKDIR(output_folder);

    int idx = 0;
    for (int r = 0; r < TILE_ROWS; r++) {
        for (int c2 = 0; c2 < TILE_COLS; c2++) {
            unsigned char* tile = malloc(tile_w * tile_h);
            for (int y = 0; y < tile_h; y++) {
                memcpy(
                    tile + y * tile_w,
                    final + (r * tile_h + y) * final_w + (c2 * tile_w),
                    tile_w
                );
            }

            char path[256];
            snprintf(path, sizeof(path), "%s/tile_%03d.jpg", output_folder, idx);
            stbi_write_jpg(path, tile_w, tile_h, 1, tile, 90);
            free(tile);
            idx++;
        }
    }

    free(final);
    printf("✔ %s → %s (%dx%d, %d tiles)\n",
           input_path, output_folder, final_w, final_h, TOTAL_TILES);

    return 0;
}

/* -------------------------------------------------- */
/* Main                                               */
/* -------------------------------------------------- */
int main() {
    const char* input_dir = "../assets/temp/";
    DIR* dir = opendir(input_dir);
    if (!dir) {
        printf("Cannot open temp folder\n");
        return 1;
    }

    struct dirent* ent;
    int img_index = 1;

    while ((ent = readdir(dir)) != NULL) {
        if (ent->d_type != DT_REG) continue;

        char input_path[256];
        snprintf(input_path, sizeof(input_path), "%s%s", input_dir, ent->d_name);

        char folder_large[64];
        char folder_small[64];

        snprintf(folder_large, sizeof(folder_large), "image_%d", img_index);
        snprintf(folder_small, sizeof(folder_small), "image_%d_small", img_index);

        process_image(input_path, folder_large, LARGE_W, LARGE_H);
        process_image(input_path, folder_small, SMALL_W, SMALL_H);

        img_index++;
    }

    closedir(dir);
    printf("Done. All images processed.\n");
    return 0;
}

