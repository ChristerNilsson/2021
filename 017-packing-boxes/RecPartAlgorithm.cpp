#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <map>

#include <sys/resource.h>
#include <sys/time.h>
#include <sys/times.h>

#include <iostream>

#include "bd.h"
#include "sets.h"
#include "draw.h"
#include "graphics.h"
#include "util.h"

/******************************************************************
 ******************************************************************/

int solve(int L, int *q);

int **lowerBound, **upperBound;

int *indexX, *indexY;

Set normalSetX;

int *normalize;

std::map<int, int> *solutionMap;
int *solution;

std::map<int, int> *divisionPointMap;
int *divisionPoint;

int l, w;

int memory_type;

CutPoint **cutPoints;

int *indexRasterX, *indexRasterY;
int numRasterX, numRasterY;

inline int roundToNearest(double a) {
  return (int) floor(a + 0.5);
}

inline int R_UpperBound(int x, int y) {
  x = normalize[x];
  y = normalize[y];
  return upperBound[indexX[x]][indexY[y]];
}

inline int L_UpperBound(int *q) {
  return (q[0] * q[1] - (q[0] - q[2]) * (q[1] - q[3])) / (l * w);
}

inline int R_LowerBound(int x, int y) {
  x = normalize[x];
  y = normalize[y];
  return lowerBound[indexX[x]][indexY[y]];
}

inline int L_LowerBound(int *q, bool *horizontalCut) {

  int a = lowerBound[indexX[normalize[q[2]       ]]]
                    [indexY[normalize[q[1] - q[3]]]]
          +
          lowerBound[indexX[normalize[q[0]]]]
                    [indexY[normalize[q[3]]]];

  int b = lowerBound[indexX[normalize[q[2]]]]
                    [indexY[normalize[q[1]]]]
          +
          lowerBound[indexX[normalize[q[0] - q[2]]]]
                    [indexY[normalize[q[3]       ]]];

  if(a > b) {
    *horizontalCut = true;
    return a;
  }
  else {
    *horizontalCut = false;
    return b;
  }
}

void divide(int *i, int *q, int *q1, int *q2, void (*standardPosition)(int*, int*, int*, int*)) {
  (*standardPosition)(i, q, q1, q2);
  normalizePiece(q1);
  normalizePiece(q2);
}

inline int getSolution(int L, int key) {
  if(memory_type == MEM_TYPE_4) {
    return solution[L] & nRet;
  }
  else {
    return solutionMap[L][key] & nRet;
  }
}

inline int getSolution(int L, int *q) {
  if(memory_type == MEM_TYPE_4) {
    return solution[L] & nRet;
  }
  else {
    int key = getKey(q[0], q[1], q[2], q[3], memory_type);
    return solutionMap[L][key] & nRet;
  }
}

inline int getSolution(int L, int *q, int *key) {
  if(memory_type == MEM_TYPE_4) {
    return solution[L];
  }
  else {
    *key = getKey(q[0], q[1], q[2], q[3], memory_type);
    return solutionMap[L][*key];
  }
}

inline void storeSolution(int L, int key, int LSolution) {
  if(memory_type == MEM_TYPE_4) {
    solution[L] = LSolution;
  }
  else {
    solutionMap[L][key] = LSolution;
  }
}

inline void storeDivisionPoint(int L, int key, int point) {
  if(memory_type == MEM_TYPE_4) {
    divisionPoint[L] = point;
  }
  else {
    divisionPointMap[L][key] = point;
  }
}

inline bool optimal(int L, int key, int upperBound) {
  int Lsolution = getSolution(L, key);
  if((Lsolution & nRet) == upperBound) {
    return true;
  }
  return false;
}

int divideL(int L, int *q, int *constraints, int B,
            void (*standardPosition)(int*, int*, int*, int*),
            Set X, int startX, Set Y, int startY) {

  int i_k[2];
  int i_x, i_y;
  int q1[4], q2[4];

  int key = 0;
  int LSolution = getSolution(L, q, &key);
  int upperBound = L_UpperBound(q);

  for(i_x = startX; i_x < X.size; i_x++) {

    i_k[0] = X.points[i_x];
    if(i_k[0] > constraints[1]) {
      break;
    }

    for(i_y = startY; i_y < Y.size; i_y++) {

      i_k[1] = Y.points[i_y];
      if(i_k[1] > constraints[3]) {
        break;
      }

      divide(i_k, q, q1, q2, (*standardPosition));
      if(q1[0] < 0 || q2[0] < 0) {
        continue;
      }

      if(L_UpperBound(q1) + L_UpperBound(q2) > (LSolution & nRet)) {
        /* It is possible that this division gets a better solution. */
        int L1 = LIndex(q1[0], q1[1], q1[2], q1[3], memory_type);
        int L2 = LIndex(q2[0], q2[1], q2[2], q2[3], memory_type);
	int L1Solution = solve(L1, q1);
	int L2Solution = solve(L2, q2);

        if((L1Solution & nRet) + (L2Solution & nRet) > (LSolution & nRet)) {
          /* A better solution was found. */
          LSolution = ((L1Solution & nRet) + (L2Solution & nRet))
            | (B << descSol);
          storeSolution(L, key, LSolution);
          storeDivisionPoint(L, key, i_k[0] | (i_k[1] << descPtoDiv2));
          if((LSolution & nRet) == upperBound) {
            return LSolution;
          }
        }
      }
    }
  }
  return LSolution;
}

int divideB6(int L, int *q, Set X, Set Y) {

  int i_k[3];
  int q1[4], q2[4];
  int key = 0;
  int LSolution = getSolution(L, q, &key);
  int upperBound = R_UpperBound(q[0], q[1]);

  int i = 0;
  for(i_k[0] = X.points[i]; i < X.size; i++) {

    i_k[0] = X.points[i];

    int j = i;
    for(i_k[2] = X.points[j]; j < X.size; j++) {

      i_k[2] = X.points[j];
      if(i_k[0] == 0 && i_k[2] == 0) {
        continue;
      }

      int k = 0;
      for(i_k[1] = Y.points[k]; k < Y.size; k++) {

        i_k[1] = Y.points[k];
        divide(i_k, q, q1, q2, standardPositionB6);
        if(q1[0] < 0 || q2[0] < 0) {
          continue;
        }

        if(L_UpperBound(q1) + L_UpperBound(q2) > (LSolution & nRet)) {
          /* It is possible that this division gets a better solution. */
          int L1 = LIndex(q1[0], q1[1], q1[2], q1[3], memory_type);
          int L2 = LIndex(q2[0], q2[1], q2[2], q2[3], memory_type);
          int L1Solution = solve(L1, q1);
          int L2Solution = solve(L2, q2);

          if((L1Solution & nRet) + (L2Solution & nRet) > (LSolution & nRet)) {
            /* A better solution was found. */
            LSolution = ((L1Solution & nRet) + (L2Solution & nRet))
              | (B6 << descSol);
            storeSolution(L, key, LSolution);
            storeDivisionPoint(L, key, i_k[0] | (i_k[1] << descPtoDiv2) |
                               (i_k[2] << descPtoDiv3));

            if((LSolution & nRet) == upperBound) {
              return LSolution;
            }
          }
        }
      }
    }
  }
  return LSolution;
}

int divideB7(int L, int *q, Set X, Set Y) {

  int i_k[3];
  int q1[4], q2[4];
  int key = 0;
  int LSolution = getSolution(L, q, &key);
  int upperBound = R_UpperBound(q[0], q[1]);

  int j = 0;
  for(i_k[1] = Y.points[j]; j < Y.size; j++) {

    i_k[1] = Y.points[j];

    int k = j;
    for(i_k[2] = Y.points[k]; k < Y.size; k++) {

      i_k[2] = Y.points[k];
      if(i_k[1] == 0 && i_k[2] == 0) {
        continue;
      }

      int i = 0;
      for(i_k[0] = X.points[i]; i < X.size; i++) {

        i_k[0] = X.points[i];
        divide(i_k, q, q1, q2, standardPositionB7);
        if(q1[0] < 0 || q2[0] < 0) {
          continue;
        }

        if(L_UpperBound(q1) + L_UpperBound(q2) > (LSolution & nRet)) {
          /* It is possible that this division gets a better solution. */
          int L1 = LIndex(q1[0], q1[1], q1[2], q1[3], memory_type);
          int L2 = LIndex(q2[0], q2[1], q2[2], q2[3], memory_type);
          int L1Solution = solve(L1, q1);
          int L2Solution = solve(L2, q2);

          if(((L1Solution & nRet) + (L2Solution & nRet)) > (LSolution & nRet)) {
            /* A better solution was found. */
            LSolution = ((L1Solution & nRet) + (L2Solution & nRet))
              | (B7 << descSol);
            storeSolution(L, key, LSolution);
            storeDivisionPoint(L, key, i_k[0] | (i_k[1] << descPtoDiv2) |
                               (i_k[2] << descPtoDiv3));

            if((LSolution & nRet) == upperBound) {
              return LSolution;
            }
          }
        }
      }
    }
  }
  return LSolution;
}

int solve(int L, int *q) {

  int key = 0;
  if(memory_type == MEM_TYPE_4) {
    if(solution[L] != -1) {
      /* This problem has already been solved. */
      return solution[L];
    }
  }
  else {
    key = getKey(q[0], q[1], q[2], q[3], memory_type);
    if(solutionMap[L].count(key) > 0) {
      /* This problem has already been solved. */
      return solutionMap[L][key];
    }
  }

  if(q[0] != q[2]) {
    bool horizontalCut;
    int lowerBound = L_LowerBound(q, &horizontalCut);
    int upperBound = L_UpperBound(q);
    int LSolution  = lowerBound | (B1 << descSol);

    if(horizontalCut)
      storeDivisionPoint(L, key, 0 | (q[3] << descPtoDiv2));
    else
      storeDivisionPoint(L, key, q[2] | (0 << descPtoDiv2));

    storeSolution(L, key, LSolution);

    /* Try to solve this problem with homogeneous packing (or other
     * better solution already computed). */
    if((LSolution & nRet) != upperBound) {
      /* It was not possible to solve this problem with homogeneous
       * packing. */
      int constraints[4];
      int startX = 0;
      int startY = 0;

      /* Construct the raster points sets X and Y. */
      Set X, Y;
      constructRasterPoints(q[0], q[1], &X, &Y, normalSetX);
      for(startX = 0; X.points[startX] < q[2]; startX++);
      for(startY = 0; Y.points[startY] < q[3]; startY++);

      /***********************************
       * 0 <= x' <= x  and  0 <= y' <= y *
       ***********************************/
      constraints[0] = 0; constraints[1] = q[2];
      constraints[2] = 0; constraints[3] = q[3];

      LSolution = divideL(L, q, constraints, B1, standardPositionB1, X,0,Y,0);
      if((LSolution & nRet) == upperBound) {
        free(X.points);
        free(Y.points);
        return LSolution;
      }

      LSolution = divideL(L, q, constraints, B3, standardPositionB3, X,0,Y,0);
      if((LSolution & nRet) == upperBound) {
        free(X.points);
        free(Y.points);
        return LSolution;
      }

      LSolution = divideL(L, q, constraints, B5, standardPositionB5, X,0,Y,0);
      if((LSolution & nRet) == upperBound) {
        free(X.points);
        free(Y.points);
        return LSolution;
      }

      constraints[0] = 0;    constraints[1] = q[2];
      constraints[2] = q[3]; constraints[3] = Y.points[Y.size - 1];

      LSolution = divideL(L, q, constraints, B2, standardPositionB2,
                          X, 0, Y, startY);
      if((LSolution & nRet) == upperBound) {
        free(X.points);
        free(Y.points);
        return LSolution;
      }

      LSolution = divideL(L, q, constraints, B8, standardPositionB8,
                          X, 0, Y, startY);
      if((LSolution & nRet) == upperBound) {
        free(X.points);
        free(Y.points);
        return LSolution;
      }

      constraints[0] = q[2]; constraints[1] = X.points[X.size - 1];
      constraints[2] = 0;    constraints[3] = q[3];

      LSolution = divideL(L, q, constraints, B4, standardPositionB4,
                          X, startX, Y, 0);
      if((LSolution & nRet) == upperBound) {
        free(X.points);
        free(Y.points);
        return LSolution;
      }

      LSolution = divideL(L, q, constraints, B9, standardPositionB9,
                          X, startX, Y, 0);
      free(X.points);
      free(Y.points);
    }
    return LSolution;
  } /* if q[0] != q[2] */
  else {

    int LSolution = R_LowerBound(q[0], q[1]) | (HOMOGENEOUS << descSol);
    int upperBound = R_UpperBound(q[0], q[1]);
    storeSolution(L, key, LSolution);

    /* Verify whether it could not be solved with homogeneous packing. */
    if((LSolution & nRet) != upperBound) {

      /* Construct the raster points sets X and Y. */
      Set X, Y;
      constructRasterPoints(q[0], q[1], &X, &Y, normalSetX);

      LSolution = divideB6(L, q, X, Y);
      if((LSolution & nRet) == upperBound) {
        free(X.points);
        free(Y.points);

        /* Update the lower bound for this rectangular piece. */
        lowerBound[indexX[q[0]]][indexY[q[1]]] = LSolution & nRet;

        return LSolution;
      }

      LSolution = divideB7(L, q, X, Y);

      free(X.points);
      free(Y.points);

      /* Update the lower bound for this rectangular piece. */
      lowerBound[indexX[q[0]]][indexY[q[1]]] = LSolution & nRet;
    }
    return LSolution;
  }
}

void makeIndices(int L, int W) {

  Set X, Y, raster;
  constructRasterPoints(L, W, &X, &Y, normalSetX);

  int j = 0;
  int k = 0;
  int i = 0;

  raster = newSet(L + 2);
  while(i < X.size && X.points[i] <= L &&
        j < Y.size && Y.points[j] <= W) {

    if(X.points[i] == Y.points[j]) {
      raster.points[k++] = X.points[i++];
      raster.size++;
      j++;
    }
    else if(X.points[i] < Y.points[j]) {
      raster.points[k++] = X.points[i++];
      raster.size++;
    }
    else {
      raster.points[k++] = Y.points[j++];
      raster.size++;
    }
  }
  while(i < X.size && X.points[i] <= L) {
    if(X.points[i] > raster.points[k-1]) {
      raster.points[k++] = X.points[i];
      raster.size++;
    }
    i++;
  }
  if(k > 0 && raster.points[k-1] < L) {
    raster.points[k++] = L;
    raster.size++;
  }
  raster.points[k] = L + 1;
  raster.size++;

  try {
    indexRasterX = new int[L + 2];
    indexRasterY = new int[W + 2];
  }
  catch (std::exception& e) {
    std::cout << "Error allocating memory." << std::endl;
    exit(0);
  }

  j = 0;
  numRasterX = 0;
  for(int i = 0; i <= L; i++) {

    if(raster.points[j] == i) {
      indexRasterX[i] = numRasterX++;
      j++;
    }
    else {
      indexRasterX[i] = indexRasterX[i - 1];
    }
  }
  indexRasterX[L + 1] = indexRasterX[L] + 1;

  j = 0;
  numRasterY = 0;
  for(int i = 0; i <= W; i++) {
    if(raster.points[j] == i) {
      indexRasterY[i] = numRasterY++;
      j++;
    }
    else {
      indexRasterY[i] = indexRasterY[i - 1];
    }
  }
  indexRasterY[W + 1] = indexRasterY[W] + 1;

  free(raster.points);
  free(X.points);
  free(Y.points);
}

void freeMemory() {
  if(memory_type == MEM_TYPE_4) {
    delete[] solution;
    delete[] divisionPoint;
  }
  else {
    delete[] solutionMap;
    delete[] divisionPointMap;
  }
  delete[] indexRasterX;
  delete[] indexRasterY;
}

bool tryAllocateMemory(int size) {
  try {
    solutionMap = new std::map<int, int>[size];
  }
  catch (std::exception& e) {
    if(size == 0) {
      std::cout << "Error allocating memory." << std::endl;
      exit(0);
    }
    return false;
  }
  try {
    divisionPointMap = new std::map<int, int>[size];
  }
  catch (std::exception& e) {
    delete [] solutionMap;
    delete [] divisionPointMap;
    if(size == 0) {
      std::cout << "Error allocating memory." << std::endl;
      exit(0);
    }
    return false;
  }
  return true;
}

void allocateMemory() {
  memory_type = MEM_TYPE_4;

  int nL = roundToNearest((pow((double)numRasterX,
                               ceil((double)memory_type / 2.0)) *
                           pow((double)numRasterY,
                               floor((double)memory_type / 2.0))));

  memory_type--;

  if(nL >= 0) {
    try {
      solution = new int[nL];
      try {
        divisionPoint =  new int[nL];
        for(int i = 0; i < nL; i++)
          solution[i] = -1;
      }
      catch (std::exception& e) {

        delete[] solution;
        do {
          nL = roundToNearest((pow((double)numRasterX,
                                   ceil((double)memory_type/ 2.0)) *
                               pow((double)numRasterY,
                                   floor((double)memory_type / 2.0))));

          memory_type--;

          if(nL >= 0 && tryAllocateMemory(nL)) {
            break;
          }
        } while(memory_type >= 0);
      }
    }
    catch (std::exception& e) {
      do {
        nL = roundToNearest((pow((double)numRasterX,
                                 ceil((double)memory_type / 2.0)) *
                             pow((double)numRasterY,
                                 floor((double)memory_type / 2.0))));

        memory_type--;

        if(nL >= 0 && tryAllocateMemory(nL)) {
          break;
        }
      } while(memory_type >= 0);
    }
  }
  else {
    do {
      nL = roundToNearest((pow((double)numRasterX,
                               ceil((double)memory_type / 2.0)) *
                           pow((double)numRasterY,
                               floor((double)memory_type / 2.0))));

        memory_type--;

      if(nL >= 0 && tryAllocateMemory(nL)) {
        break;
      }
    } while(memory_type >= 0);
  }
  memory_type++;
}

/******************************************************************
 ******************************************************************/

int main() {
  int L, W;
  int q[4];
  int BD_solution, L_solution;
  int INDEX;
  double BD_time, L_time;
  struct rusage usage, prev_usage;
  int L_n, W_n;

  /* Read L, W, l and w from standard input. */
  printf("L and W: ");
  if(scanf("%d %d", &L, &W) != 2) {
    printf("Invalid input.\n");
    exit(0);
  }
  printf("l and w: ");
  if(scanf("%d %d", &l, &w) != 2) {
    printf("Invalid input.\n");
    exit(0);
  }

  if(L < W) {
    std::swap(L, W);
  }

  memory_type = 5;

  /* Try to solve the problem with Algorithm 1. */
  getrusage(RUSAGE_SELF, &prev_usage);
  BD_solution = solve_BD(L, W, l, w, 0);
  getrusage(RUSAGE_SELF, &usage);

  BD_time =
    (((double) usage.ru_utime.tv_sec +
      ((double) usage.ru_utime.tv_usec / 1e06)) -
     ((double) prev_usage.ru_utime.tv_sec +
      ((double) prev_usage.ru_utime.tv_usec / 1e06)));

  printf("\nPhase 1 (Five-block Algorithm)\n");
  printf(" - solution found: %d box", BD_solution);
  if(BD_solution >= 2) {
    printf("es");
  }
  printf(".\n");
  printf(" - runtime:        %.2f second", BD_time);
  if(BD_time >= 2.0) {
    printf("s");
  }
  printf("\n");

  L_solution = -1;
  L_time = 0.0;

  L_n = normalize[L];
  W_n = normalize[W];

  if(BD_solution != upperBound[indexX[L_n]][indexY[W_n]]) {
    /* The solution obtained by Algorithm 1 is not known to be
     * optimal. Then it will try to solve the problem with
     * L-Algorithm. */

    getrusage(RUSAGE_SELF, &prev_usage);

    makeIndices(L_n, W_n);
    allocateMemory();

    q[0] = q[2] = L_n;
    q[1] = q[3] = W_n;

    INDEX = LIndex(q[0], q[1], q[2], q[3], memory_type);
    solve(INDEX, q);
    L_solution = getSolution(INDEX, q);

    draw(L, W, INDEX, q, L_solution & nRet, true);
    freeMemory();

    getrusage(RUSAGE_SELF, &usage);

    L_time = (((double) usage.ru_utime.tv_sec +
               ((double) usage.ru_utime.tv_usec / 1e06)) -
              ((double) prev_usage.ru_utime.tv_sec +
               ((double) prev_usage.ru_utime.tv_usec / 1e06)));

    printf("\nPhase 2 (L-Algorithm)\n");
    printf(" - solution found: %d box", L_solution);
    if(L_solution >= 2) {
      printf("es");
    }
    printf(".\n");
    printf(" - runtime:        %.2f second", L_time);
    if(L_time >= 2.0) {
      printf("s");
    }
    printf("\n");

  }
  else {
    q[0] = q[2] = L_n;
    q[1] = q[3] = W_n;
    draw(L, W, 0, q, BD_solution, false);
  }

  makeGraphics();

  int n = std::max(BD_solution, L_solution);
  printf("\nSolution found: %d box", n);
  if(n >= 2) {
    printf("es");
  }
  printf(".\n");

  int upper = upperBound[indexX[L_n]][indexY[W_n]];
  printf("\nComputed upper bound: %d box", upper);
  if(upper >= 2) {
    printf("es");
  }
  printf(".\n");

  if(upper == n) {
    printf("Proven optimal solution.\n");
  }

  double time =  BD_time + L_time;
  printf("Runtime: %.2f second", time);
  if(time >= 2.0) {
    printf("s");
  }
  printf(".\n");

  for(int i = 0; i < normalSetX.size; i++) {
    free(lowerBound[i]);
    free(upperBound[i]);
    free(cutPoints[i]);
  }
  delete[] lowerBound;
  delete[] upperBound;
  delete[] cutPoints;
  delete[] indexX;
  delete[] indexY;
  delete[] normalize;
  delete[] normalSetX.points;

  return 0;
}
