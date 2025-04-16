// catch-game.component.ts
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for bindings in template if used more broadly, good practice

// Define Point type for clarity
interface Point {
  x: number;
  y: number;
}

interface ClickPoint extends Point {
  error: number;
  color: string;
}

interface CometPath {
  splinePoints: Point[];
  targetPoints: Point[];
  guidePositionsX: number[];
  guideStartX: number;
  stripWidth: number;
}

interface LaserState {
  active: boolean;
  start: Point | null;
  end: Point | null;
  progress: number;
  startTime: number;
}

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [CommonModule], // Import CommonModule if using *ngIf, *ngFor etc.
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
  // Consider OnPush for performance if updates are controlled
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamePageComponent implements OnInit, AfterViewInit, OnDestroy {
  // --- Template References ---
  @ViewChild('gameCanvas', { static: true })
  gameCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gameContainer', { static: true })
  gameContainerRef!: ElementRef<HTMLDivElement>;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private gameContainer!: HTMLDivElement;

  // --- Base Resolution for Scaling ---
  readonly BASE_WIDTH = 1000;
  readonly BASE_HEIGHT = 700;
  private scaleX = 1;
  private scaleY = 1;

  // --- Game Settings (Constants) ---
  readonly MIN_DURATION_SECS = 4;
  readonly MAX_DURATION_SECS = 10;
  readonly MIN_SPEED = 1;
  readonly MAX_SPEED = 10;
  readonly MIN_CLICKS = 4;
  readonly MAX_CLICKS = 10;
  readonly SCORE_WIDTH_UNIT = 100;
  readonly LASER_DURATION_MS = 150;
  readonly DEFAULT_TELESCOPE_ANGLE = -Math.PI / 6;
  readonly TELESCOPE_SMOOTHING_FACTOR = 0.1;
  readonly SPLINE_SEGMENT_POINTS = 10;
  readonly SCORE_SENSITIVITY_FACTOR = 0.5;
  readonly TAIL_SMOOTHING_FACTOR = 0.15;

  // --- Game State Variables ---
  gameState: 'idle' | 'animating' | 'clicking' | 'scoring' | 'showing_results' =
    'idle';
  startTime = 0;
  cometPath: CometPath = {
    splinePoints: [],
    targetPoints: [],
    guidePositionsX: [],
    guideStartX: 0,
    stripWidth: 0,
  };
  userClicks: ClickPoint[] = [];
  currentClickIndex = 0;
  score = 0;
  laser: LaserState = {
    active: false,
    start: null,
    end: null,
    progress: 0,
    startTime: 0,
  };
  mousePos: Point = { x: this.BASE_WIDTH / 2, y: this.BASE_HEIGHT / 2 };
  currentTelescopeAngleDisplay = this.DEFAULT_TELESCOPE_ANGLE;
  currentSpeedValue = this.MAX_SPEED; // Default speed
  trajectoryDuration = this.MIN_DURATION_SECS * 1000; // Initial duration based on max speed
  clicksRequired = this.MIN_CLICKS; // Default difficulty
  currentTailAngleDisplay = Math.PI;
  startButtonText = 'Start Game';
  private animationFrameId: number | null = null;
  private lastTimestamp = 0;

  // Inject ChangeDetectorRef if using OnPush strategy
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Initial calculations that don't depend on the view
    this.trajectoryDuration = this.calculateDurationFromSpeed(
      this.currentSpeedValue
    );
  }

  ngAfterViewInit(): void {
    // Access canvas and context *after* view is initialized
    this.canvas = this.gameCanvasRef.nativeElement;
    this.gameContainer = this.gameContainerRef.nativeElement;
    const context = this.canvas.getContext('2d');
    if (!context) {
      console.error('Failed to get 2D context');
      return;
    }
    this.ctx = context;

    // Initial setup involving DOM elements
    this.resizeCanvas(); // Call resize initially to set dimensions and scale
    this.updateControlButtonsState(); // Set initial button states
    this.redrawStaticElements(); // Draw initial idle state
  }

  ngOnDestroy(): void {
    // Cleanup: Cancel animation frame if component is destroyed
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    // Remove window resize listener (handled automatically by @HostListener)
  }

  // --- Window Resize Listener ---
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeCanvas();
  }

  // --- Canvas Sizing and Scaling ---
  resizeCanvas(): void {
    if (!this.canvas || !this.gameContainer) return;

    const containerWidth = this.gameContainer.clientWidth;
    const containerHeight = this.gameContainer.clientHeight;
    const containerAspectRatio = containerWidth / containerHeight;
    const baseAspectRatio = this.BASE_WIDTH / this.BASE_HEIGHT;

    let newCanvasWidth;
    let newCanvasHeight;

    if (containerAspectRatio > baseAspectRatio) {
      newCanvasHeight = containerHeight;
      newCanvasWidth = newCanvasHeight * baseAspectRatio;
    } else {
      newCanvasWidth = containerWidth;
      newCanvasHeight = newCanvasWidth / baseAspectRatio;
    }

    this.canvas.width = Math.floor(newCanvasWidth);
    this.canvas.height = Math.floor(newCanvasHeight);

    // Calculate uniform scale factor
    const scaleFactorX = this.canvas.width / this.BASE_WIDTH;
    const scaleFactorY = this.canvas.height / this.BASE_HEIGHT;
    const uniformScale = Math.min(scaleFactorX, scaleFactorY);
    this.scaleX = uniformScale;
    this.scaleY = uniformScale;

    // Redraw static elements after resize ONLY if not actively animating
    if (this.gameState !== 'animating') {
      this.redrawStaticElements();
    } else {
      // Handle resize during animation - maybe show a message or pause?
      // For now, just let the loop continue; next frame will use new scale.
      // Or force a redraw with a message:
      this.redrawStaticElements(); // Will draw "Resized during animation..."
    }
  }

  // --- Redraw Static Elements ---
  redrawStaticElements(): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(this.scaleX, this.scaleY);

    // Drawing Order: Mountains -> Ground -> Barrel -> Base -> Dome
    this.drawMountains();
    this.drawGround();
    this.drawTelescopeBarrel(this.currentTelescopeAngleDisplay);
    this.drawLabBase();
    this.drawDome();

    // State specific elements
    if (this.gameState === 'showing_results') {
      this.drawGuides(false);
      this.drawSplineTrajectory();
      this.userClicks.forEach((click) => this.drawClickMarker(click));
      this.drawScore(this.score);
      this.drawMessage('Click Restart to Play Again', 30);
    } else if (this.gameState === 'idle') {
      this.drawMessage('Click Start to Play!');
    } else if (this.gameState === 'clicking') {
      this.drawGuides();
      this.userClicks.forEach((click) => this.drawClickMarker(click));
      this.drawMessage(
        `Click ${this.currentClickIndex + 1} / ${this.clicksRequired}`,
        30
      );
    } else if (this.gameState === 'animating') {
      // Show a message if resize happened during animation
      this.drawMessage('Resized during animation...', 30);
    }

    // Draw score in idle or results state
    if (this.gameState === 'idle' || this.gameState === 'showing_results') {
      this.drawScore(this.score);
    }

    this.ctx.restore();
  }

  // --- Drawing Functions ---
  // (Copy all draw... functions here, ensuring they use 'this.ctx' and 'this.BASE_WIDTH', etc.)
  // Example:
  drawGround(): void {
    const groundHeight = this.BASE_HEIGHT * 0.2;
    this.ctx.fillStyle = '#6b4423';
    this.ctx.fillRect(
      0,
      this.BASE_HEIGHT - groundHeight,
      this.BASE_WIDTH,
      groundHeight
    );
  }

  drawLabBase(): void {
    const groundHeight = this.BASE_HEIGHT * 0.2;
    const labBaseWidth = 80;
    const labBaseHeight = 50;
    const labX = this.BASE_WIDTH / 2 - labBaseWidth / 2;
    const labY = this.BASE_HEIGHT - groundHeight - labBaseHeight;
    this.ctx.fillStyle = '#B0C4DE';
    this.ctx.fillRect(labX, labY, labBaseWidth, labBaseHeight);
    this.ctx.strokeStyle = '#708090';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(labX, labY, labBaseWidth, labBaseHeight);
  }

  drawMountains(): void {
    const groundHeight = this.BASE_HEIGHT * 0.2;
    this.ctx.fillStyle = '#4a3a2a';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.BASE_HEIGHT - groundHeight);
    // Simplified points for brevity - copy exact points from original
    this.ctx.lineTo(this.BASE_WIDTH * 0.15, this.BASE_HEIGHT * 0.4);
    this.ctx.lineTo(this.BASE_WIDTH * 0.3, this.BASE_HEIGHT - groundHeight);
    this.ctx.lineTo(this.BASE_WIDTH * 0.25, this.BASE_HEIGHT - groundHeight);
    this.ctx.lineTo(this.BASE_WIDTH * 0.4, this.BASE_HEIGHT * 0.5);
    this.ctx.lineTo(this.BASE_WIDTH * 0.55, this.BASE_HEIGHT - groundHeight);
    this.ctx.lineTo(this.BASE_WIDTH * 0.5, this.BASE_HEIGHT - groundHeight);
    this.ctx.lineTo(this.BASE_WIDTH * 0.65, this.BASE_HEIGHT * 0.3);
    this.ctx.lineTo(this.BASE_WIDTH * 0.8, this.BASE_HEIGHT - groundHeight);
    this.ctx.lineTo(this.BASE_WIDTH * 0.75, this.BASE_HEIGHT - groundHeight);
    this.ctx.lineTo(this.BASE_WIDTH * 0.9, this.BASE_HEIGHT * 0.6);
    this.ctx.lineTo(this.BASE_WIDTH, this.BASE_HEIGHT - groundHeight);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawTelescopeBarrel(angle: number): void {
    const groundHeight = this.BASE_HEIGHT * 0.2;
    const labBaseHeight = 50;
    const labCenterX = this.BASE_WIDTH / 2;
    const labDomeY = this.BASE_HEIGHT - groundHeight - labBaseHeight; // Pivot point Y
    this.ctx.fillStyle = '#A9A9A9';
    this.ctx.save();
    this.ctx.translate(labCenterX, labDomeY);
    this.ctx.rotate(angle);
    const tubeWidth = 10;
    const tubeLength = 60;
    this.ctx.fillRect(-tubeWidth / 2, -tubeLength, tubeWidth, tubeLength); // Draw upwards from pivot
    this.ctx.restore();
  }

  drawDome(): void {
    const groundHeight = this.BASE_HEIGHT * 0.2;
    const labBaseWidth = 80;
    const labBaseHeight = 50;
    const labX = this.BASE_WIDTH / 2 - labBaseWidth / 2;
    const labY = this.BASE_HEIGHT - groundHeight - labBaseHeight;
    const domeRadius = labBaseWidth * 0.55;
    this.ctx.fillStyle = '#E8E8E8';
    this.ctx.beginPath();
    this.ctx.arc(labX + labBaseWidth / 2, labY, domeRadius, Math.PI, 0); // Half circle
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.strokeStyle = '#708090';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  drawComet(x: number, y: number, tailAngle: number): void {
    const headRadius = 8;
    // Head
    const headGradient = this.ctx.createRadialGradient(
      x,
      y,
      1,
      x,
      y,
      headRadius
    );
    headGradient.addColorStop(0, 'white');
    headGradient.addColorStop(0.5, 'cyan');
    headGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
    this.ctx.fillStyle = headGradient;
    this.ctx.fillRect(
      x - headRadius,
      y - headRadius,
      headRadius * 2,
      headRadius * 2
    );

    // Tail (v49 logic)
    const tailLength = 50;
    const tailWidthFactor = 0.7;
    const tipX = x + Math.cos(tailAngle) * tailLength;
    const tipY = y + Math.sin(tailAngle) * tailLength;
    const baseAngle1 = tailAngle + Math.PI / 2;
    const baseAngle2 = tailAngle - Math.PI / 2;
    const baseOffsetX = headRadius * tailWidthFactor;
    const baseOffsetY = headRadius * tailWidthFactor;
    const corner1X = x + Math.cos(baseAngle1) * baseOffsetX;
    const corner1Y = y + Math.sin(baseAngle1) * baseOffsetY;
    const corner2X = x + Math.cos(baseAngle2) * baseOffsetX;
    const corner2Y = y + Math.sin(baseAngle2) * baseOffsetY;
    const baseCenterX = (corner1X + corner2X) / 2;
    const baseCenterY = (corner1Y + corner2Y) / 2;

    const tailGradient = this.ctx.createLinearGradient(
      baseCenterX,
      baseCenterY,
      tipX,
      tipY
    );
    const fadeStartFraction = Math.min(0.99, headRadius / tailLength);
    const startColor = 'rgba(0, 255, 255, 0.7)';
    const endColor = 'rgba(0, 255, 255, 0)';

    tailGradient.addColorStop(0, startColor);
    if (fadeStartFraction > 0) {
      tailGradient.addColorStop(fadeStartFraction, startColor);
    }
    tailGradient.addColorStop(1, endColor);
    this.ctx.fillStyle = tailGradient;

    this.ctx.beginPath();
    this.ctx.moveTo(tipX, tipY);
    this.ctx.lineTo(corner1X, corner1Y);
    this.ctx.lineTo(corner2X, corner2Y);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawGuides(useCyan = false): void {
    if (
      !this.cometPath.guidePositionsX ||
      this.cometPath.guidePositionsX.length !== this.clicksRequired
    )
      return;
    this.ctx.strokeStyle = useCyan
      ? 'rgba(0, 255, 255, 0.6)'
      : 'rgba(255, 255, 0, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);
    const skyHeight = this.BASE_HEIGHT * 0.8; // Only draw within the sky area
    this.cometPath.guidePositionsX.forEach((lineX) => {
      const clampedX = Math.max(0, Math.min(this.BASE_WIDTH, lineX)); // Ensure guides stay within base bounds
      this.ctx.beginPath();
      this.ctx.moveTo(clampedX, 0);
      this.ctx.lineTo(clampedX, skyHeight);
      this.ctx.stroke();
    });
    this.ctx.setLineDash([]); // Reset line dash
  }

  drawClickMarker(click: ClickPoint): void {
    this.ctx.beginPath();
    const radius = 5;
    this.ctx.arc(click.x, click.y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = click.color || 'rgba(255, 255, 255, 0.8)'; // Use calculated color or default
    this.ctx.fill();
    this.ctx.strokeStyle = 'black'; // Outline for visibility
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  drawLaser(laserState: LaserState): void {
    if (!laserState.active || !laserState.start || !laserState.end) return;
    const dx = laserState.end.x - laserState.start.x;
    const dy = laserState.end.y - laserState.start.y;
    const currentX = laserState.start.x + dx * laserState.progress;
    const currentY = laserState.start.y + dy * laserState.progress;

    this.ctx.strokeStyle = '#FF0000'; // Red laser
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(laserState.start.x, laserState.start.y);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();
  }

  drawScore(value: number): void {
    this.ctx.font = "bold 20px 'Press Start 2P', monospace"; // Ensure font is loaded
    this.ctx.fillStyle = '#FFFF00'; // Yellow score
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(`Score: ${value.toFixed(0)}/100`, 20, 20); // Position top-left
  }

  drawMessage(text: string, yPos: number = this.BASE_HEIGHT / 2.5): void {
    this.ctx.font = "16px 'Press Start 2P', monospace"; // Ensure font is loaded
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, this.BASE_WIDTH / 2, yPos);
  }

  drawHoverMarker(x: number, y: number): void {
    const radius = 4;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'; // Semi-transparent white
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  // --- Catmull-Rom Spline Calculation ---
  getCatmullRomPoint(
    t: number,
    p0: Point,
    p1: Point,
    p2: Point,
    p3: Point
  ): Point {
    const t2 = t * t;
    const t3 = t * t * t;
    const x =
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
    const y =
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
    return { x, y };
  }

  getCatmullRomDerivative(
    t: number,
    p0: Point,
    p1: Point,
    p2: Point,
    p3: Point
  ): { vx: number; vy: number } {
    const t2 = t * t;
    const dx_dt =
      0.5 *
      (-p0.x +
        p2.x +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * 2 * t +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * 3 * t2);
    const dy_dt =
      0.5 *
      (-p0.y +
        p2.y +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * 2 * t +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * 3 * t2);
    return { vx: dx_dt, vy: dy_dt };
  }

  /** Draws the full Catmull-Rom spline */
  drawSplineTrajectory(): void {
    const points = this.cometPath.splinePoints;
    if (!points || points.length < 4) {
      console.warn('Not enough points to draw spline:', points?.length);
      return;
    }
    this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)'; // Green trajectory
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    // Need points before and after the current segment for Catmull-Rom
    let p_neg1 = points[0]; // Virtual point before the start (use start point)
    let p0 = points[0];
    let p1 = points[1];
    let p2 = points[2];

    // Draw first segment (k=0)
    let startP = this.getCatmullRomPoint(0, p_neg1, p0, p1, p2);
    this.ctx.moveTo(startP.x, startP.y);

    const n = points.length;
    for (let k = 0; k < n - 1; k++) {
      // Iterate through segments defined by p1 and p2
      // Define the 4 points needed for the segment between points[k] (p1) and points[k+1] (p2)
      p0 = points[Math.max(0, k - 1)]; // Point before p1
      p1 = points[k]; // Start point of segment
      p2 = points[Math.min(n - 1, k + 1)]; // End point of segment
      const p3 = points[Math.min(n - 1, k + 2)]; // Point after p2

      for (let i = 1; i <= this.SPLINE_SEGMENT_POINTS; i++) {
        let t = i / this.SPLINE_SEGMENT_POINTS; // Parameter t from 0 to 1 within the segment
        let p = this.getCatmullRomPoint(t, p0, p1, p2, p3);
        this.ctx.lineTo(p.x, p.y);
      }
    }
    this.ctx.stroke();
  }

  // --- Trajectory Generation ---
  generateTrajectory(): void {
    const numClicks = this.clicksRequired;
    const numStrips = numClicks + 1; // One more strip than clicks
    const numSplinePoints = numClicks + 2; // Need points outside the clicking area

    // Reset path data
    this.cometPath = {
      splinePoints: [],
      targetPoints: [],
      guidePositionsX: [],
      guideStartX: 0,
      stripWidth: 0,
    };
    this.userClicks = [];
    this.currentClickIndex = 0;

    const paddingY = this.BASE_HEIGHT * 0.1; // Top/bottom padding for comet path
    const skyHeight = this.BASE_HEIGHT * 0.8; // Usable vertical space (below score, above ground)
    const midSkyY = skyHeight / 2; // Reference, not strictly used here

    // Calculate guide positions based on full base width
    this.cometPath.guideStartX = 0; // Start guides from the left edge
    const visibleWidth = this.BASE_WIDTH;
    this.cometPath.stripWidth = visibleWidth / numStrips;

    // Generate X positions for the vertical guide lines
    for (let i = 1; i <= numClicks; i++) {
      const lineX = this.cometPath.guideStartX + this.cometPath.stripWidth * i;
      this.cometPath.guidePositionsX.push(lineX);
    }

    // Function to generate random Y within the allowed sky area
    const randomY = () => Math.random() * (skyHeight - 2 * paddingY) + paddingY;

    // Generate spline points: 1 before first guide, 1 for each guide, 1 after last guide
    // Point 0 (Before first guide)
    this.cometPath.splinePoints.push({
      x: this.cometPath.guideStartX - this.cometPath.stripWidth,
      y: randomY(),
    });

    // Points 1 to numClicks (Aligned with guides)
    for (let i = 0; i < numClicks; i++) {
      this.cometPath.splinePoints.push({
        x: this.cometPath.guidePositionsX[i],
        y: randomY(),
      });
    }

    // Point numClicks + 1 (After last guide)
    this.cometPath.splinePoints.push({
      x:
        this.cometPath.guidePositionsX[numClicks - 1] +
        this.cometPath.stripWidth,
      y: randomY(),
    });

    // Target points are the spline points that align with the guides
    this.cometPath.targetPoints = this.cometPath.splinePoints.slice(
      1,
      numClicks + 1
    );

    // Validation (optional but good practice)
    if (
      this.cometPath.guidePositionsX.length !== numClicks ||
      this.cometPath.splinePoints.length !== numSplinePoints ||
      this.cometPath.targetPoints.length !== numClicks
    ) {
      console.error(
        'Trajectory generation failed array length checks!',
        this.cometPath
      );
    }
    // console.log("Generated Trajectory:", this.cometPath);
  }

  // --- Scoring Logic ---
  calculateScore(): void {
    let totalErrorPixels = 0;
    for (let i = 0; i < this.clicksRequired; i++) {
      // Ensure both click and target exist for this index
      if (!this.userClicks[i] || !this.cometPath.targetPoints[i]) {
        console.error(`Missing data for score calculation at index ${i}`);
        // Assign max penalty if data is missing? Or skip?
        // For now, let's assume it results in max error for this click
        totalErrorPixels += this.BASE_HEIGHT; // Assign a large error
        continue; // Skip to next iteration
      }

      const click = this.userClicks[i];
      const target = this.cometPath.targetPoints[i];

      // Calculate vertical distance error
      const dy = click.y - target.y;
      const errorDist = Math.abs(dy);
      click.error = errorDist; // Store error on the click object
      totalErrorPixels += errorDist;

      // Determine click marker color based on error (Red=High Error, Blue=Low Error)
      // Scale error relative to a portion of the screen height
      const errorScaleFactor = this.BASE_HEIGHT * this.SCORE_SENSITIVITY_FACTOR; // e.g., 50% of height = max error visually
      const normalizedErrorRatio = Math.min(
        1,
        Math.max(0, errorDist / errorScaleFactor)
      ); // Clamp between 0 and 1

      const red = Math.floor(255 * normalizedErrorRatio);
      const blue = Math.floor(255 * (1 - normalizedErrorRatio)); // Inversely proportional to red
      click.color = `rgb(${red}, 0, ${blue})`; // Use RGB for color gradient
    }

    // Calculate final score (0-100) based on total error
    // Max possible error assumes each click was off by maxSingleError
    const maxSingleError = this.BASE_HEIGHT * this.SCORE_SENSITIVITY_FACTOR;
    const maxTotalErrorPossible = this.clicksRequired * maxSingleError;

    let errorRatio = 0;
    if (maxTotalErrorPossible > 0) {
      errorRatio = totalErrorPixels / maxTotalErrorPossible;
    } else {
      // Avoid division by zero if clicksRequired is 0 (shouldn't happen with MIN_CLICKS)
      errorRatio = totalErrorPixels > 0 ? 1 : 0;
    }

    // Clamp error ratio just in case
    errorRatio = Math.max(0, Math.min(1, errorRatio));

    // Score is inversely proportional to error ratio
    this.score = (1 - errorRatio) * 100;
    // console.log(`Score calculated: ${this.score.toFixed(2)}, Total Error: ${totalErrorPixels.toFixed(2)}, Max Possible Error: ${maxTotalErrorPossible.toFixed(2)}`);
  }

  // --- Game Control Functions ---
  toggleStartReset(): void {
    if (this.gameState === 'idle' || this.gameState === 'showing_results') {
      this.startGame();
    } else {
      this.resetGame(); // Allow reset mid-game
    }
  }

  startGame(): void {
    console.log('Starting game...');
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId); // Stop previous loop if any

    // Reset state variables
    this.gameState = 'idle'; // Temporarily idle while setting up
    this.userClicks = [];
    this.currentClickIndex = 0;
    this.score = 0;
    this.cometPath = {
      splinePoints: [],
      targetPoints: [],
      guidePositionsX: [],
      guideStartX: 0,
      stripWidth: 0,
    };
    this.laser = {
      active: false,
      start: null,
      end: null,
      progress: 0,
      startTime: 0,
    };
    this.startButtonText = 'Restart Game'; // Change button text immediately
    this.mousePos = { x: this.BASE_WIDTH / 2, y: this.BASE_HEIGHT / 2 }; // Reset mouse pos
    this.currentTelescopeAngleDisplay = this.DEFAULT_TELESCOPE_ANGLE; // Reset telescope angle
    this.currentTailAngleDisplay = Math.PI; // Reset tail angle

    this.generateTrajectory(); // Create the new path
    this.updateControlButtonsState(); // Disable controls

    this.gameState = 'animating'; // Set state to animating
    this.startTime = performance.now(); // Record start time for animation timing
    this.lastTimestamp = this.startTime; // Initialize lastTimestamp

    // Start the game loop
    this.animationFrameId = requestAnimationFrame((timestamp) =>
      this.gameLoop(timestamp)
    );
    // this.cdr.detectChanges(); // Trigger change detection if using OnPush
  }

  resetGame(): void {
    console.log('Resetting game state...');
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId); // Stop the loop
      this.animationFrameId = null;
    }

    // Reset state variables to initial values
    this.gameState = 'idle';
    this.userClicks = [];
    this.currentClickIndex = 0;
    // Keep score displayed from last round until next game starts? Or reset here?
    // this.score = 0; // Uncomment to reset score display immediately
    this.cometPath = {
      splinePoints: [],
      targetPoints: [],
      guidePositionsX: [],
      guideStartX: 0,
      stripWidth: 0,
    };
    this.laser = {
      active: false,
      start: null,
      end: null,
      progress: 0,
      startTime: 0,
    };
    this.startButtonText = 'Start Game'; // Reset button text
    this.mousePos = { x: -999, y: -999 }; // Move mouse off-canvas initially
    this.currentTelescopeAngleDisplay = this.DEFAULT_TELESCOPE_ANGLE;
    this.currentTailAngleDisplay = Math.PI;

    this.updateControlButtonsState(); // Re-enable controls
    this.redrawStaticElements(); // Redraw the idle screen
    // this.cdr.detectChanges(); // Trigger change detection if using OnPush
  }

  /** Handles mouse clicks on the canvas */
  handleCanvasClick(event: MouseEvent): void {
    if (this.gameState !== 'clicking') return; // Only handle clicks during the clicking phase

    if (
      !this.cometPath.guidePositionsX ||
      this.cometPath.guidePositionsX.length !== this.clicksRequired
    ) {
      console.error(
        'Cannot handle click: Guide positions not set up correctly.'
      );
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    // Calculate click coordinates relative to the canvas element
    const clickXScreen = event.clientX - rect.left;
    const clickYScreen = event.clientY - rect.top;

    // Convert screen coordinates to base (unscaled) coordinates
    let clickYBase = 0;
    if (this.scaleY > 0) {
      clickYBase = clickYScreen / this.scaleY;
    } else {
      console.error('Scale Y is zero, cannot process click.');
      return; // Avoid division by zero
    }

    // Determine the target guide line based on the current click index
    const targetLineIndex = this.currentClickIndex; // Index from 0 to clicksRequired-1

    // Basic validation for the index
    if (
      targetLineIndex < 0 ||
      targetLineIndex >= this.cometPath.guidePositionsX.length
    ) {
      console.error(`Invalid targetLineIndex: ${targetLineIndex}`);
      return;
    }

    // Snap the X coordinate to the target guide line's X position
    const snappedX = this.cometPath.guidePositionsX[targetLineIndex];

    // Validate Y coordinate - Ensure click is within the playable sky area
    const skyHeight = this.BASE_HEIGHT * 0.8;
    if (clickYBase < 0 || clickYBase > skyHeight) {
      // console.log("Click ignored: Outside vertical play area.");
      return; // Ignore clicks outside the designated area
    }

    // Add the click to the user's clicks array
    this.userClicks.push({
      x: snappedX,
      y: clickYBase,
      error: 0,
      color: 'white',
    }); // Initial color

    // --- Trigger Laser ---
    const groundHeight = this.BASE_HEIGHT * 0.2;
    const labBaseHeight = 50;
    const labCenterX = this.BASE_WIDTH / 2;
    const labDomeY = this.BASE_HEIGHT - groundHeight - labBaseHeight; // Laser origin Y

    this.laser.start = { x: labCenterX, y: labDomeY }; // Laser starts from dome pivot
    this.laser.end = { x: snappedX, y: clickYBase }; // Laser ends at the click point
    this.laser.progress = 0;
    this.laser.active = true;
    this.laser.startTime = performance.now();
    // --- End Laser ---

    this.currentClickIndex++; // Move to the next required click

    // Check if all required clicks have been made
    if (this.currentClickIndex >= this.clicksRequired) {
      console.log(`${this.clicksRequired} clicks reached. Calculating score.`);
      this.laser.active = false; // Ensure laser stops visually if calculation is fast
      this.gameState = 'scoring'; // Transition state
      this.calculateScore();
      this.updateControlButtonsState(); // Re-enable controls after scoring is done (in game loop scoring->showing_results transition)
    }

    // Optional: Redraw immediately to show the new marker/laser start
    // this.redrawStaticElements(); // Or let the game loop handle redraw
    // this.cdr.detectChanges(); // Trigger change detection if using OnPush
  }

  /** Handles mouse movement over the canvas */
  handleMouseMove(event: MouseEvent): void {
    // Only track mouse if in the clicking phase for telescope aiming/hover marker
    if (this.gameState !== 'clicking') return;

    const rect = this.canvas.getBoundingClientRect();
    const mouseXScreen = event.clientX - rect.left;
    const mouseYScreen = event.clientY - rect.top;

    // Convert screen coordinates to base (unscaled) coordinates
    if (this.scaleX > 0) {
      this.mousePos.x = mouseXScreen / this.scaleX;
    }
    if (this.scaleY > 0) {
      this.mousePos.y = mouseYScreen / this.scaleY;
    }
    // We don't necessarily need to redraw on every mouse move,
    // the game loop will handle drawing the hover marker and aiming the telescope.
  }

  /** Calculates trajectory duration based on speed value (1-10) */
  calculateDurationFromSpeed(speedValue: number): number {
    const speedRange = this.MAX_SPEED - this.MIN_SPEED;
    const durationRange = this.MAX_DURATION_SECS - this.MIN_DURATION_SECS;

    // Ensure speedValue is within bounds
    const clampedSpeed = Math.max(
      this.MIN_SPEED,
      Math.min(this.MAX_SPEED, speedValue)
    );

    // Calculate duration: Higher speed means shorter duration.
    // Use linear interpolation inverted.
    const durationSecs =
      this.MAX_DURATION_SECS -
      ((clampedSpeed - this.MIN_SPEED) / speedRange) * durationRange;

    return durationSecs * 1000; // Convert seconds to milliseconds
  }

  /** Helper to check if game is in a state where controls should be enabled */
  isIdleOrDone(): boolean {
    return this.gameState === 'idle' || this.gameState === 'showing_results';
  }

  /** Updates ALL control button enabled states based on game state and values */
  updateControlButtonsState(): void {
    // This logic is now handled by [disabled] bindings in the HTML template.
    // This method can be kept for explicit state changes or removed if not needed.
    // If using OnPush, you might need to trigger change detection after state changes
    // that affect bindings.
    // console.log("Updating button states (now handled by template bindings)");
    this.cdr.detectChanges(); // Explicitly trigger change detection after state changes affect bindings
  }

  /** Decreases speed value */
  decreaseSpeed(): void {
    if (this.currentSpeedValue > this.MIN_SPEED) {
      this.currentSpeedValue--;
      this.trajectoryDuration = this.calculateDurationFromSpeed(
        this.currentSpeedValue
      );
      // Update button states via change detection
      this.updateControlButtonsState();
    }
  }

  /** Increases speed value */
  increaseSpeed(): void {
    if (this.currentSpeedValue < this.MAX_SPEED) {
      this.currentSpeedValue++;
      this.trajectoryDuration = this.calculateDurationFromSpeed(
        this.currentSpeedValue
      );
      this.updateControlButtonsState();
    }
  }

  /** Decreases difficulty (number of clicks) */
  decreaseClicks(): void {
    if (this.clicksRequired > this.MIN_CLICKS) {
      this.clicksRequired--;
      this.updateControlButtonsState();
    }
  }

  /** Increases difficulty (number of clicks) */
  increaseClicks(): void {
    if (this.clicksRequired < this.MAX_CLICKS) {
      this.clicksRequired++;
      this.updateControlButtonsState();
    }
  }

  // --- Main Game Loop ---
  gameLoop(timestamp: number): void {
    if (!this.ctx) {
      // Ensure context exists
      console.error('Game loop running without context.');
      this.animationFrameId = null;
      return;
    }

    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Clear canvas for redraw
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(this.scaleX, this.scaleY); // Apply scaling for all drawing

    // --- Calculate Comet Position & Tail Angle FIRST (if animating) ---
    let cometPos: Point | null = null;
    let targetTailAngle = this.currentTailAngleDisplay; // Start with current angle

    if (this.gameState === 'animating') {
      const overall_t = Math.min(
        (timestamp - this.startTime) / this.trajectoryDuration,
        1.0
      ); // Progress 0 to 1
      const numSegments = this.cometPath.splinePoints.length - 3; // Catmull-Rom uses 4 points, defines curve between p1 and p2

      if (numSegments > 0 && this.cometPath.splinePoints.length >= 4) {
        // Map overall progress (0-1) to the segment index and local t within that segment
        let totalCurveLength = numSegments; // Each segment is considered length 1 for t mapping
        let currentPositionAlongCurve = overall_t * totalCurveLength;
        let segmentIdx = Math.floor(currentPositionAlongCurve);
        segmentIdx = Math.min(segmentIdx, numSegments - 1); // Clamp index

        let local_t = currentPositionAlongCurve - segmentIdx; // t within the current segment (0-1)
        local_t = Math.max(0, Math.min(1, local_t)); // Clamp t

        // Determine the 4 control points for the Catmull-Rom spline calculation
        // Segment 'segmentIdx' is between splinePoints[segmentIdx+1] and splinePoints[segmentIdx+2]
        const n_pts = this.cometPath.splinePoints.length;
        const p0_idx = segmentIdx; // Point before the segment start
        const p1_idx = segmentIdx + 1; // Segment start
        const p2_idx = Math.min(n_pts - 1, segmentIdx + 2); // Segment end
        const p3_idx = Math.min(n_pts - 1, segmentIdx + 3); // Point after the segment end

        // Get the points (handle boundary cases implicitly included in index calculation)
        const p0 = this.cometPath.splinePoints[p0_idx];
        const p1 = this.cometPath.splinePoints[p1_idx];
        const p2 = this.cometPath.splinePoints[p2_idx];
        const p3 = this.cometPath.splinePoints[p3_idx];

        if (p0 && p1 && p2 && p3) {
          // Ensure all points are valid
          cometPos = this.getCatmullRomPoint(local_t, p0, p1, p2, p3);
          const velocity = this.getCatmullRomDerivative(
            local_t,
            p0,
            p1,
            p2,
            p3
          );

          // Calculate tail angle based on velocity direction (points opposite to motion)
          if (Math.abs(velocity.vx) > 0.01 || Math.abs(velocity.vy) > 0.01) {
            // Avoid division by zero or NaN angle
            const motionAngle = Math.atan2(velocity.vy, velocity.vx);
            targetTailAngle = motionAngle + Math.PI; // Tail points opposite direction
          }

          // --- Smooth Tail Rotation ---
          let deltaTailAngle = targetTailAngle - this.currentTailAngleDisplay;
          // Normalize angle difference to be within [-PI, PI] for shortest rotation
          if (deltaTailAngle > Math.PI) {
            deltaTailAngle -= 2 * Math.PI;
          }
          if (deltaTailAngle < -Math.PI) {
            deltaTailAngle += 2 * Math.PI;
          }

          // Apply smoothing factor
          if (Math.abs(deltaTailAngle) > 0.001) {
            // Threshold to prevent infinite small adjustments
            this.currentTailAngleDisplay +=
              deltaTailAngle * this.TAIL_SMOOTHING_FACTOR;
            // Normalize angle after update
            this.currentTailAngleDisplay =
              (this.currentTailAngleDisplay + 2 * Math.PI) % (2 * Math.PI);
          } else {
            this.currentTailAngleDisplay = targetTailAngle; // Snap if close enough
          }
          // --- End Smooth Tail Rotation ---

          // Clamp comet Y position to stay within sky bounds (adjust if needed)
          const paddingY = this.BASE_HEIGHT * 0.1;
          const skyHeight = this.BASE_HEIGHT * 0.8;
          if (cometPos) {
            cometPos.y = Math.max(
              paddingY / 2,
              Math.min(skyHeight - paddingY / 2, cometPos.y)
            );
          }
        } else {
          console.error(
            'Error calculating comet position: Invalid spline points for segment',
            segmentIdx,
            p0,
            p1,
            p2,
            p3
          );
          // Maybe stop animation or handle error?
          cometPos = null; // Prevent drawing if calculation failed
        }
      }

      // --- Animation End Condition ---
      if (overall_t >= 1.0) {
        this.gameState = 'clicking'; // Transition to clicking phase
        this.updateControlButtonsState(); // Enable/disable appropriate controls
        // Reset mouse position state? Optional.
        this.mousePos = { x: -999, y: -999 }; // Move mouse off-canvas initially
      }
    } // End if (gameState === 'animating')

    // --- Draw Background Elements (Order: Sky(bg)->Comet->Mountains->Ground->Barrel->Base->Dome) ---
    // Comet should be drawn *before* mountains/ground if it passes behind them near horizon
    if (this.gameState === 'animating' && cometPos) {
      const headRadius = 8; // Approximate visual size for culling
      // Only draw if comet is potentially visible (within canvas bounds + buffer)
      if (
        cometPos.x >= -headRadius &&
        cometPos.x <= this.BASE_WIDTH + headRadius
      ) {
        this.drawComet(cometPos.x, cometPos.y, this.currentTailAngleDisplay);
      }
    }
    this.drawMountains();
    this.drawGround();

    // --- Telescope Angle Smoothing & Drawing ---
    let targetTelescopeAngle = this.DEFAULT_TELESCOPE_ANGLE; // Default aiming pos
    let hoverTargetX = this.BASE_WIDTH / 2; // Default hover X
    let hoverTargetY = this.BASE_HEIGHT * 0.4; // Default hover Y

    if (this.gameState === 'clicking') {
      const targetLineIndex = this.currentClickIndex;
      // Ensure we have a valid next target line
      if (
        targetLineIndex >= 0 &&
        targetLineIndex < this.cometPath.guidePositionsX.length
      ) {
        hoverTargetX = this.cometPath.guidePositionsX[targetLineIndex]; // Aim X at the current guide line
        // Use mouse Y for aiming, but clamp within sky area
        hoverTargetY = Math.max(
          0,
          Math.min(this.BASE_HEIGHT * 0.8, this.mousePos.y)
        );

        // Aim telescope only if mouse has moved onto the canvas (y > -99 assumed initial state)
        if (this.mousePos.y > -99) {
          const groundHeight = this.BASE_HEIGHT * 0.2;
          const labBaseHeight = 50;
          const labCenterX = this.BASE_WIDTH / 2;
          const labDomeY = this.BASE_HEIGHT - groundHeight - labBaseHeight; // Telescope pivot Y

          // Calculate angle from pivot point to the hover target point
          const deltaY = hoverTargetY - labDomeY;
          const deltaX = hoverTargetX - labCenterX;
          targetTelescopeAngle = Math.atan2(deltaY, deltaX) + Math.PI / 2; // Add PI/2 because barrel draws vertically at angle 0
        }
      }
      // If all clicks are done, maybe aim somewhere default or keep last angle?
      // Current logic defaults to DEFAULT_TELESCOPE_ANGLE if not clicking state.
    }

    // --- Smooth Telescope Rotation ---
    let deltaAngle = targetTelescopeAngle - this.currentTelescopeAngleDisplay;
    // Normalize angle difference
    if (deltaAngle > Math.PI) {
      deltaAngle -= 2 * Math.PI;
    }
    if (deltaAngle < -Math.PI) {
      deltaAngle += 2 * Math.PI;
    }

    if (Math.abs(deltaAngle) > 0.001) {
      this.currentTelescopeAngleDisplay +=
        deltaAngle * this.TELESCOPE_SMOOTHING_FACTOR;
      // Normalize angle after update
      this.currentTelescopeAngleDisplay =
        (this.currentTelescopeAngleDisplay + 2 * Math.PI) % (2 * Math.PI);
    } else {
      this.currentTelescopeAngleDisplay = targetTelescopeAngle; // Snap if close
    }
    // --- End Smooth Telescope Rotation ---

    this.drawTelescopeBarrel(this.currentTelescopeAngleDisplay); // Draw telescope barrel *before* base/dome
    this.drawLabBase(); // Draw base over barrel pivot
    this.drawDome(); // Draw dome over barrel pivot

    // --- Laser Animation ---
    if (this.laser.active) {
      const elapsedLaserTime = timestamp - this.laser.startTime;
      this.laser.progress = Math.min(
        1,
        elapsedLaserTime / this.LASER_DURATION_MS
      );
      // Need laser origin point for drawing function
      const groundHeight = this.BASE_HEIGHT * 0.2;
      const labBaseHeight = 50;
      const labCenterX = this.BASE_WIDTH / 2;
      const labDomeY = this.BASE_HEIGHT - groundHeight - labBaseHeight;
      this.drawLaser(this.laser); // Pass the whole state

      if (this.laser.progress >= 1) {
        this.laser.active = false; // Deactivate laser after it reaches the end
      }
    }

    // --- State Specific Overlays / UI Elements ---
    switch (this.gameState) {
      case 'clicking':
        this.drawGuides(true); // Use cyan guides during clicking
        this.userClicks.forEach((click) => this.drawClickMarker(click)); // Draw placed markers
        // Draw hover marker only if mouse is over canvas and targeting a line
        if (
          this.mousePos.y > -99 &&
          this.currentClickIndex < this.clicksRequired
        ) {
          this.drawHoverMarker(hoverTargetX, hoverTargetY);
        }
        this.drawMessage(
          `Click ${this.currentClickIndex + 1} / ${this.clicksRequired}`,
          30
        ); // Instructions
        break;

      // @ts-ignore
      case 'scoring':
        // This state is transient, move directly to showing results
        this.gameState = 'showing_results';
        this.updateControlButtonsState(); // Ensure controls are enabled for results screen
        if (false) {
          break;
        } // Trick linter/compiler to allow intentional fallthrough
      case 'showing_results':
        this.drawGuides(false); // Yellow guides for results
        this.drawSplineTrajectory(); // Show the ideal path
        this.userClicks.forEach((click) => this.drawClickMarker(click)); // Show user clicks with error colors
        this.drawScore(this.score); // Display final score
        this.drawMessage('Click Restart to Play Again', 30); // Instructions
        break;

      case 'idle':
        // Draw score (0 initially, or last score if reset)
        this.drawScore(this.score);
        this.drawMessage('Click Start to Play!');
        break;

      case 'animating':
        // Message is handled by redrawStaticElements if resize occurs
        // Otherwise, no specific message during animation besides comet moving.
        break;
    }

    this.ctx.restore(); // Restore context after scaling

    // --- Loop Condition ---
    // Continue looping if animating, clicking, laser is active, or telescope/tail is still rotating smoothly
    const isTelescopeRotating =
      Math.abs(targetTelescopeAngle - this.currentTelescopeAngleDisplay) >
      0.001;
    const isTailRotating =
      this.gameState === 'animating' &&
      Math.abs(targetTailAngle - this.currentTailAngleDisplay) > 0.001;

    if (
      this.gameState === 'animating' ||
      this.gameState === 'clicking' ||
      this.laser.active ||
      isTelescopeRotating ||
      isTailRotating
    ) {
      this.animationFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
    } else {
      // Loop should stop naturally when idle or showing results and no animations are pending
      this.animationFrameId = null;
      console.log('Game loop stopped. State:', this.gameState);
      // If stopped on 'showing_results', ensure final state is drawn correctly
      if (this.gameState === 'showing_results') {
        this.redrawStaticElements(); // One final draw for stable results screen
      }
      // If using OnPush, might need a final detectChanges here if the last frame's state wasn't rendered
      this.cdr.detectChanges();
    }
  } // End gameLoop
} // End class
