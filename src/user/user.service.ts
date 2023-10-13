import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RegisterDto } from '../authentication/dto/in/register.dto';
import { UserGetDto } from './dto/out/user-get.dto';
import { UserEntity } from './entities/user.entity';
import { UserAuthDto } from './dto/protected/user-auth.dto';
import { UserUpdateDto } from './dto/in/user-update.dto';
import { FestivalEntity } from '../festival/entities/festival.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(FestivalEntity)
    private festivalRepository: Repository<FestivalEntity>,
  ) { }

  async getAll(): Promise<UserGetDto[]> {
    const entities: UserEntity[] = await this.usersRepository.find();
    const results: UserGetDto[] = [];

    entities.forEach(async (userEntity: UserEntity) => {
      results.push(new UserGetDto(userEntity));
    });

    return results;
  }

  async getById(userId: number): Promise<UserGetDto | null> {
    const userEntity: UserEntity | null = await this.usersRepository.findOneBy({
      id: userId,
    });
    return userEntity ? new UserGetDto(userEntity) : null;
  }

  async getByEmail(userEmail: string): Promise<UserGetDto | null> {
    const userEntity: UserEntity | null = await this.usersRepository.findOneBy({
      email: userEmail,
    });
    return userEntity ? new UserGetDto(userEntity) : null;
  }

  async create(userDto: RegisterDto): Promise<UserGetDto> {
    const newUser: UserEntity = this.usersRepository.create(userDto);
    await this.usersRepository.save(newUser);
    return new UserGetDto(newUser);
  }

  /**
   * Met à jours les informations
   * d'un instance UserEntity
   * contrôle l'intégrité des données
   * @param userDto
   * @returns
   */
  async update(userDto: UserUpdateDto): Promise<UserGetDto> {
    // on fait directement une recherche avec les deux données importantes
    // qui  ne peuvent être changée en même temps que le reste
    const user: UserEntity | null = await this.usersRepository.findOneBy({
      id: userDto.id,
      email: userDto.email,
    });
    if (user) {
      user.firstname =
        userDto.firstname === undefined ? user.firstname : userDto.firstname;
      user.lastname =
        userDto.lastname === undefined ? user.lastname : userDto.lastname;

      await this.usersRepository.save(user);

      return new UserGetDto(user);
    } else {
      throw new BadRequestException('user to modify not found');
    }
  }

  async updateUserAvatarUrl(
    imagePath: string,
    userId: number,
  ): Promise<UserGetDto> {
    const user: UserEntity | null = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new BadRequestException('user to modify not found');
    }

    // We make sure the path has a correct format for browser url - useful on windows
    const formatedPath: string = imagePath.replaceAll(/\\\\*/gm, '/');
    const regexp: RegExp = /public\/\S*/g;
    const regexpResult: RegExpMatchArray | null = formatedPath.match(regexp);
    if (regexpResult) {
      user.avatarUrl = regexpResult[0].replace('public', '');
      await this.usersRepository.save(user);
    }

    return new UserGetDto(user);
  }

  async updatePassword(userDto: UserAuthDto, resetPwdToken?: string) {
    const user: UserEntity | null = await this.usersRepository.findOneBy({
      id: userDto.id,
    });

    if (!user) {
      throw new BadRequestException('user to modify not found');
    }
    if (resetPwdToken && resetPwdToken !== user.resetPwdToken) {
      throw new UnauthorizedException('reset token is not for specified user');
    }

    user.password = userDto.password;
    user.resetPwdToken = null;

    await this.usersRepository.save(user);
  }
  async updatePasswordToken(userId: number, token: string): Promise<boolean> {
    const user: UserEntity | null = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (!user) return false;
    user.resetPwdToken = token;
    this.usersRepository.save(user);
    return true;
  }

  async getHashedPwdFromEmail(userEmail: string): Promise<UserAuthDto | null> {
    const userEntity: UserEntity | null = await this.usersRepository.findOneBy({
      email: userEmail,
    });
    return userEntity ? new UserAuthDto(userEntity) : null;
  }
/**
 * ajoute un favoris à l'utilisateur
 * @param userId 
 * @param festivalId 
 * @returns 
 */
  async addFestivalFavorite(userId: number, festivalId: number):Promise<UserGetDto> {
    let user: UserEntity | null;
    let festival: FestivalEntity | null;

    user = await this.usersRepository.findOneBy({
      id: userId
    })
    if (!user) throw new BadRequestException("utilisateur non connecté");
    festival = await this.festivalRepository.findOneBy({
      id: festivalId
    })
    if (!festival) throw new BadRequestException("festival non trouvé ou invalide");
    if (!user.festivalFovorites) user.festivalFovorites = [];
    user.festivalFovorites.push(festival);
    return this.usersRepository.save(user)
      .then(response=> new UserGetDto(response));
  }
  
  /**
   *  retire le festival dont l'identifiant est passé en paramètre 
   * de la liste de favoris de l'utilisateur dont l'id est passé en paramètres
   * @param userId 
   * @param festivalId 
   * @returns 
   */
  async removeFestivalFavorite(userId: number, festivalId: number):Promise<UserGetDto> {
    let user: UserEntity | null;
    let festival: FestivalEntity;

    user = await this.usersRepository.findOneBy({
      id: userId
    })
    if (!user) throw new BadRequestException("utilisateur non connecté");
    // erreur si liste vide
    if (!user.festivalFovorites || user.festivalFovorites.length == 0) throw new BadRequestException("aucun festival en favory");
    user.festivalFovorites = user.festivalFovorites.filter((e) => { e.id != festivalId });
    return this.usersRepository.save(user)
      .then(response=> new UserGetDto(response));
  }
}
